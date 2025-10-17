import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignUpDto } from './dtos/auth.dto';
import { DrizzleService } from './../drizzle/drizzle.service';
import * as bcrypt from 'bcrypt';
import { UserTable } from './../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private dbService: DrizzleService,
  ) {}

  async singUp(dto: SignUpDto) {
    const { name, password, email } = dto;

    if (!name || !password || !email) {
      throw new ConflictException('Missing required fields');
    }

    // Check if user exists
    const existingUser = await this.dbService.db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new ConflictException('Email already exist');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const [user] = await this.dbService.db
      .insert(UserTable)
      .values({
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        imageUrl: dto.imageUrl,
      })
      .returning();

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

  async signIn(dto: SignInDto) {
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
