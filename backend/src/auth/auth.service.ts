import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos/auth.dto';
import { DrizzleService } from 'src/drizzle/drizzle.service';
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
  }
}
