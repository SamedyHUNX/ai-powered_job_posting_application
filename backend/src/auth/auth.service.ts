import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DrizzleService } from '@/drizzle/drizzle.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserTable } from '@/drizzle/schema';
import { and, eq, gt, or } from 'drizzle-orm';
import { S3Service } from '@/s3/s3.service';
import { AppService } from '@/app.service';
import { inngest } from '@/inngest/inngest.client';
import { hashPassword } from '@/utils/password.utils';
import { capitalizeString } from '@/utils/utils';
import { SignInDto, SignUpDto } from './dtos/auth.dto';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '@/redis/redis.module';
import { catchAsync } from '@/utils/catch-async';
import { ResponseCode, ResponseHelper } from '@/utils/response-helper';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    private jwtService: JwtService,
    private dbService: DrizzleService,
    private s3Service: S3Service,
  ) {}

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private get dbServer() {
    if (!this.dbService.db) {
      this.logger.error(
        `Database connection not established at ${this.getTimestamp}`,
      );
      throw new InternalServerErrorException(
        ResponseHelper.error(ResponseCode.SERVICE_UNAVAILABLE),
      );
    }
    return this.dbService.db;
  }

  private get redisServer() {
    if (!this.redis) {
      this.logger.error(`Redis server is down at ${new Date().toISOString()}`);
      throw new InternalServerErrorException(
        ResponseHelper.error(ResponseCode.SERVICE_UNAVAILABLE),
      );
    }
    return this.redis;
  }

  private get s3Server() {
    if (!this.s3Service) {
      this.logger.error(`S3 service is down at ${this.getTimestamp}`);
      throw new InternalServerErrorException(
        ResponseHelper.error(ResponseCode.SERVICE_UNAVAILABLE),
      );
    }
    return this.s3Service;
  }

  private generateToken(payload: any) {
    return this.jwtService.sign(payload);
  }

  signUp = catchAsync(
    async (
      dto: SignUpDto,
      file: Express.Multer.File,
      acceptLanguage: string,
    ) => {
      const { username, password, email, firstName, lastName } = dto;

      // Validate required fields from DTO
      const requiredFields = {
        username,
        password,
        email,
        firstName,
        lastName,
        file,
      };

      for (const [key, value] of Object.entries(requiredFields)) {
        if (!value) {
          const message = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
          this.logger.error(`Missing ${key}`);
          throw new ConflictException(
            ResponseHelper.error(ResponseCode.MISSING_FIELDS, key),
          );
        }
      }

      // Check if email or username already exists
      const existingUser = await this.dbServer
        .select()
        .from(UserTable)
        .where(or(eq(UserTable.email, email), eq(UserTable.username, username)))
        .limit(1);

      if (existingUser.length > 0) {
        if (existingUser[0].email === email) {
          this.logger.error(
            `User with email ${email} trying to create an account using existing email!`,
          );
          throw new ConflictException(
            ResponseHelper.error(ResponseCode.EXISTING_EMAIL),
          );
        }
        if (existingUser[0].username === username) {
          throw new ConflictException(
            ResponseHelper.error(ResponseCode.EXISTING_USERNAME),
          );
        }
      }

      if (!file || !file.originalname) {
        throw new ConflictException(
          ResponseHelper.error(ResponseCode.MISSING_PHOTO),
        );
      }

      // Upload image to S3
      const imageKey = `users/avatars/${Date.now()}-${file.originalname}`;
      await this.s3Server.uploadFile(file, imageKey);

      // Get the S3 URL (public or presigned)
      const imageUrl = `${process.env.R2_PUBLIC_DOMAIN}/${imageKey}`;

      try {
        // Hash password
        const hashedPassword = await hashPassword(password);

        // Make sure names are capitalized before placing in DB
        const capitalizedFirstName = capitalizeString(firstName);
        const capitalizedLastName = capitalizeString(lastName);

        // Generate email verification token
        const {
          token: verificationToken,
          hashedToken: hashedVerificationToken,
          expiresAt: verificationExpires,
        } = await this.generateAndHashToken(60 * 24); // 24 hours expiration

        // Send email with reset link
        const verificationUrl = `${process.env.FRONTEND_URL}/${acceptLanguage}/auth/verify-email?token=${verificationToken}`;

        // Create user
        const [user] = await this.dbServer
          .insert(UserTable)
          .values({
            username,
            email,
            firstName: capitalizedFirstName,
            lastName: capitalizedLastName,
            fullName: `${firstName} ${lastName}`,
            password: hashedPassword,
            imageUrl,
            userRole: 'USER', // Explicity set the userRole to 'USER' for security reason
            verificationToken: hashedVerificationToken,
            verificationExpires: verificationExpires,
          })
          .returning();

        // TRIGGER INNGEST EVENT for email verification
        await inngest.send({
          name: 'jobxhub/user.created',
          data: {
            userId: user.id,
            email: user.email,
            name: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            verificationUrl,
            acceptLanguage: acceptLanguage || 'en',
          },
        });

        return {
          message: 'User signed up successfully. Please verify your email.',
        };
      } catch (error) {
        // If database insertion falsi, delete the uploaded file from S3
        this.logger.warn(
          `Database insertion failed. Deleting orphaned file: ${imageKey}`,
        );
        try {
          await this.s3Server.deleteFile(imageKey);
        } catch (s3Error: any) {
          this.logger.error(
            `Failed to delete orphaned file ${imageKey}: ${s3Error.message}`,
          );
        }
        throw error;
      }
    },
    this.logger,
    `Failed to sign up user at ${this.getTimestamp()}`,
  );

  verifyEmail = catchAsync(
    async (token: string) => {
      // Hash the token from URL to compare with stored hash
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      // Find user by verification token and check expiration
      const [user] = await this.dbServer
        .select()
        .from(UserTable)
        .where(
          and(
            eq(UserTable.verificationToken, hashedToken),
            gt(UserTable.verificationExpires, new Date()),
          ),
        )
        .limit(1);

      if (!user) {
        this.logger.error('Invalid or expired email verification token used');
        throw new UnauthorizedException(
          ResponseHelper.error(ResponseCode.INVALID_TOKEN),
        );
      }

      // Update user's verified status and clear verification token fields
      await this.dbServer
        .update(UserTable)
        .set({
          isVerified: true,
          verificationToken: null,
          verificationExpires: null,
        })
        .where(eq(UserTable.id, user.id));

      this.logger.log(`Email successfully verified for user ID: ${user.id}`);
      return ResponseHelper.success(ResponseCode.EMAIL_VERIFIED);
    },
    this.logger,
    'Failed to verify email',
  );

  // SignIn function
  signIn = catchAsync(
    async (dto: SignInDto) => {
      const { email, password } = dto;

      if (!email || !password) {
        this.logger.error(`User with email ${email} missing required fields`);
        throw new ConflictException(
          ResponseHelper.error(ResponseCode.MISSING_FIELDS),
        );
      }

      // Try to get user from Redis cache
      const cachedUser = await this.getCachedUser(email);

      let user;

      if (cachedUser) {
        user = cachedUser;
      } else {
        // Find user in database
        const [dbUser] = await this.dbServer
          .select()
          .from(UserTable)
          .where(eq(UserTable.email, email))
          .limit(1);

        if (!dbUser) {
          this.logger.error(
            `User with ${email} trying to signin with invalid credentials`,
          );
          throw new UnauthorizedException(
            ResponseHelper.error(ResponseCode.INVALID_CREDENTIALS),
          );
        }

        // Check if user is banned
        if (dbUser.isBanned) {
          this.logger.error(`User with ${email} is banned`);
          throw new UnauthorizedException(
            ResponseHelper.error(ResponseCode.USER_BANNED),
          );
        }

        // Check if user is disabled
        if (dbUser.isDisabled) {
          this.logger.error(`User with ${email} is disabled`);
          throw new UnauthorizedException(
            ResponseHelper.error(ResponseCode.USER_DISABLED),
          );
        }

        // Check if user is verified
        if (!dbUser.isVerified) {
          this.logger.error(`User with ${email} is not verified`);
          throw new UnauthorizedException(
            ResponseHelper.error(ResponseCode.USER_NOT_VERIFIED),
          );
        }

        user = dbUser;

        // Cache for 15 minutes (900 seconds)
        await this.cacheUser(user);
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        this.logger.error(
          `User with ${email} trying to signin with invalid password at ${this.getTimestamp()}`,
        );
        throw new UnauthorizedException(
          ResponseHelper.error(ResponseCode.INVALID_CREDENTIALS),
        );
      }

      const payload = {
        email: user.email,
        sub: user.id,
        tokenVersion: user.tokenVersion,
      };

      const token = this.generateToken(payload);

      const resUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        imageUrl: user.imageUrl,
        userRole: user.userRole,
        token,
      };

      return ResponseHelper.success(ResponseCode.SIGNIN_SUCCESS, {
        user: resUser,
      });
    },
    this.logger,
    'Failed to sign in user',
  );

  forgotPassword = catchAsync(
    async (email: string, acceptLanguage: string, ipAddress: string) => {
      this.logger.log(`Password reset requested for email: ${email}`);

      // 1. Rate limit by IP (global)
      const ipRateLimitKey = `pwd_reset_ip:${ipAddress}`;
      const ipAttempts = await this.redis.incr(ipRateLimitKey);
      if (ipAttempts === 1) {
        await this.redis.expire(ipRateLimitKey, 3600);
      }
      if (ipAttempts > 10) {
        this.logger.warn(
          `Too many password reset requests from IP: ${ipAddress}`,
        );
        throw new BadRequestException(
          ResponseHelper.error(ResponseCode.TOO_MANY_REQUESTS),
        );
      }

      // 2. Rate limit by email
      const emailRateLimitKey = `pwd_reset_email:${email}`;
      const emailAttempts = await this.redis.incr(emailRateLimitKey);
      if (emailAttempts === 1) {
        await this.redis.expire(emailRateLimitKey, 3600);
      }
      if (emailAttempts > 3) {
        this.logger.warn(`Rate limit exceeded for email: ${email}`);
        // Still return success to prevent enumeration
        return ResponseHelper.success(ResponseCode.PASSWORD_RESET_SENT);
      }

      // Find user by email
      const [user] = await this.dbServer
        .select()
        .from(UserTable)
        .where(eq(UserTable.email, email))
        .limit(1);

      if (!user) {
        this.logger.warn(
          `Password reset requested for non-existent email: ${email} at ${this.getTimestamp()}!`,
        );
        return ResponseHelper.success(ResponseCode.PASSWORD_RESET_SENT);
      }

      // 3. Check for recent token
      if (
        user.resetPasswordExpires &&
        user.resetPasswordExpires > new Date(Date.now() - 300000)
      ) {
        return ResponseHelper.success(ResponseCode.PASSWORD_RESET_SENT);
      }

      // Generate reset token
      const {
        token: resetToken,
        hashedToken,
        expiresAt,
      } = await this.generateAndHashToken(15); // 15 minutes expiration

      // Store hashed token and expiration in DB
      await this.dbServer
        .update(UserTable)
        .set({
          resetPasswordToken: hashedToken,
          resetPasswordExpires: expiresAt,
        })
        .where(eq(UserTable.id, user.id));

      // Send email with reset link
      const resetUrl = `${process.env.FRONTEND_URL}/${acceptLanguage}/auth/reset-password?token=${resetToken}`;

      // TRIGGER INNGEST EVENT
      await inngest.send({
        name: 'jobxhub/user.reset_password_requested',
        data: {
          email,
          resetUrl,
          acceptLanguage,
        },
      });

      return ResponseHelper.success(ResponseCode.PASSWORD_RESET_SENT, {
        user: {
          email,
        },
      });
    },
    this.logger,
    'Failed to process forgot password request',
  );

  resetPassword = catchAsync(
    async (token: string, newPassword: string, confirmPassword: string) => {
      if (newPassword !== confirmPassword) {
        this.logger.error(`User provided non-matching passwords`);
        throw new BadRequestException(
          ResponseHelper.error(ResponseCode.PASSWORDS_DO_NOT_MATCH),
        );
      }

      // Hash the token from URL to compare with stored hash
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      // Find user by reset token and check expiration
      const [user] = await this.dbServer
        .select()
        .from(UserTable)
        .where(
          and(
            eq(UserTable.resetPasswordToken, hashedToken),
            gt(UserTable.resetPasswordExpires, new Date()),
          ),
        )
        .limit(1);

      if (!user) {
        this.logger.error('Invalid or expired password reset token used');
        throw new UnauthorizedException(
          ResponseHelper.error(ResponseCode.INVALID_TOKEN),
        );
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update user's password and clear reset token fields
      await this.dbServer
        .update(UserTable)
        .set({
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
          tokenVersion: user.tokenVersion + 1,
        })
        .where(eq(UserTable.id, user.id));

      // Invalidate all cached user data
      await this.invalidateUserCache(user.email, user.id);

      // Invalidate all active sessions for this user
      await this.invalidateAllUserSessions(user.id);

      this.logger.log(`Password successfully reset for user ID: ${user.id}`);
      return ResponseHelper.success(ResponseCode.PASSWORD_RESET_SUCCESS);
    },
    this.logger,
    'Failed to reset password',
  );

  async validateResetToken(token: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const [user] = await this.dbServer
      .select()
      .from(UserTable)
      .where(
        and(
          eq(UserTable.resetPasswordToken, hashedToken),
          gt(UserTable.resetPasswordExpires, new Date()),
        ),
      )
      .limit(1);

    return !!user;
  }

  private async getCachedUser(email: string) {
    const cacheKey = `user:email:${email}`;
    const cached = await this.redisServer.get(cacheKey);
    return cached ? JSON.parse(cached) : null;
  }

  private async cacheUser(user: any, ttl: number = 900) {
    const cacheKey = `user:email:${user.email}`;
    await this.redisServer.setex(cacheKey, ttl, JSON.stringify(user));
  }

  // Helper method to invalidate user cache
  private async invalidateUserCache(email: string, userId: string) {
    const pipeline = this.redisServer.pipeline();

    // Delete cache by email
    pipeline.del(`user:email:${email}`);

    // Delete cache by user ID (if you cache by ID)
    pipeline.del(`user:id:${userId}`);

    await pipeline.exec();

    this.logger.log(`Cache invalidated for user: ${email}`);
  }

  // Invalidate all sessions (force re-login on all devices)
  private async invalidateAllUserSessions(userId: string) {
    // Delete session cache
    await this.redis.del(`session:${userId}`);

    // If you store multiple sessions per user, you can use pattern matching
    const sessionKeys = await this.redis.keys(`session:${userId}:*`);
    if (sessionKeys.length > 0) {
      await this.redis.del(...sessionKeys);
    }

    this.logger.log(`All sessions invalidated for user ID: ${userId}`);
  }

  private async cacheUserByEmailAndId(user: any, ttl: number = 900) {
    const pipeline = this.redisServer.pipeline();
    pipeline.setex(`user:email:${user.email}`, ttl, JSON.stringify(user));
    pipeline.setex(`user:id:${user.id}`, ttl, JSON.stringify(user));
    await pipeline.exec();
  }

  private async generateAndHashToken(expireMinutes: number) {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    // Set token and expiration (1 hour)
    const expiresAt = new Date(Date.now() + expireMinutes * 60 * 1000);
    return { token, hashedToken, expiresAt };
  }

  validateUser = catchAsync(
    async (payload: any) => {
      if (!payload) {
        throw new BadRequestException(
          ResponseHelper.error(ResponseCode.PASSWORDS_DO_NOT_MATCH),
        );
      }
      const [user] = await this.dbServer
        .select()
        .from(UserTable)
        .where(eq(UserTable.id, payload.sub))
        .limit(1);

      if (!user) {
        this.logger.error(
          `User with ID ${payload.sub} not found during validation`,
        );
        throw new UnauthorizedException(
          ResponseHelper.error(ResponseCode.INVALID_CREDENTIALS),
        );
      }

      // Check if tokenVersion matches
      if (payload.tokenVersion !== user.tokenVersion) {
        this.logger.error(
          `Token version mismatch for user ID ${user.id}. Token invalidated.`,
        );
        throw new UnauthorizedException(
          ResponseHelper.error(ResponseCode.TOKEN_INVALIDATED),
        );
      }

      return user;
    },
    this.logger,
    'Failed to validate user',
  );
}
