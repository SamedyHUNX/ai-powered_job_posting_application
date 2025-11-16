import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignUpDto } from './dtos/auth.dto';
import { DrizzleService } from './../drizzle/drizzle.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserTable } from './../drizzle/schema';
import { and, eq, gt } from 'drizzle-orm';
import { S3Service } from '../s3/s3.service';
import { AppService } from 'src/app.service';
import { inngest } from '../inngest/inngest.client';
import { hashPassword } from './../drizzle/utils/password.utils';
import { capitalizeString } from './../utils/utils';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private jwtService: JwtService,
    private dbService: DrizzleService,
    private s3Service: S3Service,
  ) {}

  async signUp(dto: SignUpDto, file: Express.Multer.File) {
    const { name, password, email, firstName, lastName } = dto;

    // Validate required fields from DTO
    const requiredFields = { name, password, email, firstName, lastName, file };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        const message = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        this.logger.error(`Missing ${key}`);
        throw new ConflictException({
          code: 'MISSING_FIELDS',
          message,
          field: key,
        });
      }
    }

    // Check if email or username already exists
    const [existingEmail] = await this.dbService.db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email))
      .limit(1);

    if (existingEmail) {
      this.logger.error(`User with email ${email} already exists`);
      throw new ConflictException({
        code: 'EXISTING_EMAIL',
        message: 'User with this email already exists',
      });
    }

    const [existingUsername] = await this.dbService.db
      .select()
      .from(UserTable)
      .where(eq(UserTable.name, name))
      .limit(1);

    if (existingUsername) {
      this.logger.error(`Username ${name} is already taken`);
      throw new ConflictException({
        code: 'EXISTING_USERNAME',
        message: 'Username is already taken',
      });
    }

    if (!file || !file.originalname) {
      this.logger.error('File is missing or invalid');
      throw new ConflictException({
        code: 'MISSING_PHOTO',
        message: 'Profile image is required',
      });
    }

    // Upload image to S3
    const imageKey = `users/avatars/${Date.now()}-${file.originalname}`;
    await this.s3Service.uploadFile(file, imageKey);

    // Get the S3 URL (public or presigned)
    const imageUrl = `${process.env.R2_PUBLIC_DOMAIN}/${imageKey}`;

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Make sure names are capitalized before placing in DB
    const capitalizedFirstName = capitalizeString(firstName);
    const capitalizedLastName = capitalizeString(lastName);
    const capitalizedName = capitalizeString(name);

    // Create user
    const [user] = await this.dbService.db
      .insert(UserTable)
      .values({
        name: capitalizedName,
        email,
        firstName: capitalizedFirstName,
        lastName: capitalizedLastName,
        fullName: `${firstName} ${lastName}`,
        password: hashedPassword,
        imageUrl,
      })
      .returning();

    this.logger.log(`User with email ${email} created an account successfully`);

    // TRIGGER INNGEST EVENT (after user is created)
    await inngest.send({
      name: 'jobxhub/user.created',
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      },
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
      },
    };
  }

  async signIn(dto: SignInDto) {
    const { email, password } = dto;

    if (!email || !password) {
      this.logger.error('User trying to signin with missing fields');
      throw new ConflictException({
        code: 'MISSING_FIELDS',
        message: 'Missing required fields',
      });
    }

    // Find user
    const [user] = await this.dbService.db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, dto.email))
      .limit(1);

    if (!user) {
      this.logger.error('User trying to signin with invalid credentials');
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      this.logger.error(
        `User with ${email} trying to signin with invalid password`,
      );
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials',
      });
    }

    const payload = {
      email: user.email,
      sub: user.id,
      tokenVersion: user.tokenVersion,
    };

    // Generate token
    const token = this.generateToken(payload);

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
      },
      token,
    };
  }

  async validateUser(payload: any) {
    const [user] = await this.dbService.db
      .select()
      .from(UserTable)
      .where(eq(UserTable.id, payload.sub))
      .limit(1);

    if (!user) {
      this.logger.error(
        `User with ID ${payload.sub} not found during validation`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if tokenVersion matches
    if (payload.tokenVersion !== user.tokenVersion) {
      this.logger.error(
        `Token version mismatch for user ID ${user.id}. Token invalidated.`,
      );
      throw new UnauthorizedException('Token has been invalidated');
    }

    return user;
  }

  async requestPasswordReset(email: string) {
    const db = this.dbService.db;

    this.logger.log(`Password reset requested for email: ${email}`);

    // Find user by email
    const [user] = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email))
      .limit(1);

    if (!user) {
      this.logger.warn(
        `Password reset requested for non-existent email: ${email}`,
      );
      return {
        success: true,
        message: 'If an account exists, a reset link has been sent',
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set token and expiration (1 hour)
    const expiresAt = new Date(Date.now() + 3600000);

    await db
      .update(UserTable)
      .set({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expiresAt,
      })
      .where(eq(UserTable.id, user.id));

    // Send email with reset link
    const resetUrl = `${process.env.FRONTEND_URL}/en/auth/reset-password?token=${resetToken}`;

    this.logger.log(
      `Password reset requested for email: ${email}. Reset URL: ${resetUrl}`,
    );
    this.logger.log(`Reset token (for testing purposes only): ${resetToken}`);

    // TRIGGER INNGEST EVENT
    await inngest.send({
      name: 'jobxhub/user.reset_password_requested',
      data: {
        email,
        resetUrl,
      },
    });

    return {
      success: true,
      email,
      message: 'A reset link has been sent',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const db = this.dbService.db;

    // Hash the token from URL to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user by reset token and check expiration
    const [user] = await db
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
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user's password and clear reset token fields
    await db
      .update(UserTable)
      .set({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        tokenVersion: user.tokenVersion + 1,
      })
      .where(eq(UserTable.id, user.id));

    this.logger.log(`Password successfully reset for user ID: ${user.id}`);
    return { success: true, message: 'Password has been reset successfully' };
  }

  async validateResetToken(token: string) {
    const db = this.dbService.db;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const [user] = await db
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

  private generateToken(payload: any) {
    return this.jwtService.sign(payload);
  }
}
