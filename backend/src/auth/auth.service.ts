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
import { UserTable } from './../drizzle/schema';
import { eq } from 'drizzle-orm';
import { S3Service } from '../s3/s3.service';
import { AppService } from 'src/app.service';
import { File } from 'winston/lib/winston/transports';

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
    const requiredFields = { name, password, email, firstName, lastName, File };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        const message = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        this.logger.error(`Missing ${key}`);
        throw new ConflictException(message);
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
      throw new ConflictException('User with this email already exists');
    }

    const [existingUsername] = await this.dbService.db
      .select()
      .from(UserTable)
      .where(eq(UserTable.name, name))
      .limit(1);

    if (existingUsername) {
      this.logger.error(`Username ${name} is already taken`);
      throw new ConflictException('Username is already taken');
    }

    // Upload image to S3
    const imageKey = `users/avatars/${Date.now()}-${file.originalname}`;
    await this.s3Service.uploadFile(file, imageKey);

    // Get the S3 URL (public or presigned)
    const imageUrl = `${process.env.R2_PUBLIC_DOMAIN}/${imageKey}`;

    // Hash password
    const saltRounds = Number(process.env.SALT);
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // Create user
    const [user] = await this.dbService.db
      .insert(UserTable)
      .values({
        name,
        email,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        password: hashedPassword,
        imageUrl,
      })
      .returning();

    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    // Generate token
    const token = this.generateToken(user.id, user.email);

    this.logger.log(`User with email ${email} created an account successfully`);
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
      token,
    };
  }

  async signIn(dto: SignInDto) {
    const { email, password } = dto;

    if (!email || !password) {
      this.logger.error('User trying to signin with missing fields');
      throw new ConflictException('Missing required fields');
    }

    // Find user
    const [user] = await this.dbService.db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, dto.email))
      .limit(1);

    if (!user) {
      this.logger.error('User trying to signin with invalid credentials');
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      this.logger.error(
        `User with ${email} trying to signin with invalid password`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user.id, user.email);

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

  async validateUser(userId: string) {
    const result = await this.dbService.db
      .select()
      .from(UserTable)
      .where(eq(UserTable.id, userId))
      .limit(1);

    const user = result[0];

    if (!user) {
      this.logger.error(`User with ID ${userId} not found during validation`);
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
    };
  }

  private generateToken(userId: string, email: string) {
    return this.jwtService.sign({ sub: userId, email });
  }
}
