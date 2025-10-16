import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SignUpDto } from "./dtos/auth.dto";

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    async singUp(dto: SignUpDto) {
        // Check if user exists
        const existingUser = await db
    }
}