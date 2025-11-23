import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  Query,
  Headers,
  Ip,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignUpDto,
  SignInDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
} from './dtos/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { UserResponseDto } from '@/users/dtos/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  signUp(
    @Body() dto: SignUpDto,
    @UploadedFile() file: Express.Multer.File,
    @Headers('accept-language') acceptLanguage: string,
  ) {
    return this.authService.signUp(dto, file, acceptLanguage);
  }

  @Post('signin')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  getMe(@CurrentUser() user: any) {
    return plainToClass(UserResponseDto, user);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(
    @Body() { email }: RequestPasswordResetDto,
    @Headers('accept-language') acceptLanguage: string,
    @Ip() ipAddress: string,
  ) {
    return this.authService.forgotPassword(email, acceptLanguage, ipAddress);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() { token, newPassword, newConfirmPassword }: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(
      token,
      newPassword,
      newConfirmPassword,
    );
  }

  @Get('validate-reset-token')
  async validateResetToken(@Query('token') token: string) {
    const isValid = await this.authService.validateResetToken(token);
    return { valid: isValid };
  }
}
