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

    if (!name || !password || !email || !firstName || !lastName) {
      this.logger.error(
        'Missing name, password, email, firstName, or lastName',
      );
      throw new ConflictException('Missing required fields');
    }

    if (!file) {
      this.logger.error('Missing photo upload');
      throw new ConflictException('You must upload a photo');
    }

    // Check if user exists
    const existingUser = await this.dbService.db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      this.logger.error(
        `User with ${email} trying to create an existing account`,
      );
      throw new ConflictException('User already exists');
    }

    // Upload image to S3
    const imageKey = `users/avatars/${Date.now()}-${file.originalname}`;
    await this.s3Service.uploadFile(file, imageKey);

    // Get the S3 URL (public or presigned)
    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, process.env.SALT!);

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
      },
      token,
    };
  }

  async signIn(dto: SignInDto) {
    const { email, password } = dto;

    if (!email || !password) {
      throw new ConflictException('Missing required fields');
    }

    // Find user
    const [user] = await this.dbService.db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, dto.email))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentails');
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
    const result = this.dbService.db
      .select()
      .from(UserTable)
      .where(eq(UserTable.id, userId))
      .limit(1);

    const user = result[0];

    if (!user) {
      return null;
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
