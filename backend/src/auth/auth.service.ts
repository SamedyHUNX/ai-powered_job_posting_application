import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos/auth.dto';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import * as bcrypt from 'bcrypt';
import { UserTable } from 'src/drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private dbService: DrizzleService,
  ) {}

  async singUp(dto: SignUpDto) {
    // Check if user exists
    const existingUser = await this.dbService.db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, dto.email))
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
}
