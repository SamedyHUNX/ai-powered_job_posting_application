import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        signUp: jest.fn(),
        verifyEmail: jest.fn(),
        signIn: jest.fn(),
        forgotPassword: jest.fn(),
        resetPassword: jest.fn(),
        validateResetToken: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({
                canActivate: (context: ExecutionContext) => {
                    const request = context.switchToHttp().getRequest();
                    request.user = {
                        id: '1',
                        email: 'test@example.com',
                        username: 'testuser',
                    };
                    return true;
                },
            })
            .compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('POST /auth/signup', () => {
        const mockFile = {
            originalname: 'test.jpg',
            buffer: Buffer.from('test'),
            mimetype: 'image/jpeg',
        } as Express.Multer.File;

        const signUpDto = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
        };

        it('should successfully sign up a user', async () => {
            mockAuthService.signUp.mockResolvedValue({ success: true });

            const result = await controller.signUp(signUpDto, mockFile, 'en');

            expect(result).toEqual({ success: true });
            expect(mockAuthService.signUp).toHaveBeenCalledWith(
                signUpDto,
                mockFile,
                'en',
            );
        });

        it('should pass accept-language header to service', async () => {
            mockAuthService.signUp.mockResolvedValue({ success: true });

            await controller.signUp(signUpDto, mockFile, 'fr');

            expect(mockAuthService.signUp).toHaveBeenCalledWith(
                signUpDto,
                mockFile,
                'fr',
            );
        });
    });

    describe('POST /auth/verify-email', () => {
        it('should successfully verify email', async () => {
            const mockResponse = {
                success: true,
                message: 'Email has been verified successfully',
            };
            mockAuthService.verifyEmail.mockResolvedValue(mockResponse);

            const result = await controller.verifyEmail('valid-token');

            expect(result).toEqual(mockResponse);
            expect(mockAuthService.verifyEmail).toHaveBeenCalledWith('valid-token');
        });

        it('should handle verification errors', async () => {
            mockAuthService.verifyEmail.mockRejectedValue(
                new Error('Invalid token'),
            );

            await expect(controller.verifyEmail('invalid-token')).rejects.toThrow(
                'Invalid token',
            );
        });
    });

    describe('POST /auth/signin', () => {
        const signInDto = {
            email: 'test@example.com',
            password: 'password123',
        };

        it('should successfully sign in a user', async () => {
            const mockResponse = {
                success: true,
                user: {
                    id: '1',
                    username: 'testuser',
                    email: 'test@example.com',
                    imageUrl: 'https://example.com/image.jpg',
                },
                token: 'mock-jwt-token',
            };
            mockAuthService.signIn.mockResolvedValue(mockResponse);

            const result = await controller.signIn(signInDto);

            expect(result).toEqual(mockResponse);
            expect(mockAuthService.signIn).toHaveBeenCalledWith(signInDto);
        });

        it('should handle sign in errors', async () => {
            mockAuthService.signIn.mockRejectedValue(
                new Error('Invalid credentials'),
            );

            await expect(controller.signIn(signInDto)).rejects.toThrow(
                'Invalid credentials',
            );
        });
    });

    describe('GET /auth/me', () => {
        it('should return current user', () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                username: 'testuser',
                firstName: 'John',
                lastName: 'Doe',
                imageUrl: 'https://example.com/image.jpg',
            };

            const result = controller.getMe(mockUser);

            expect(result).toBeDefined();
        });

        it('should be protected by JwtAuthGuard', () => {
            const guards = Reflect.getMetadata(
                '__guards__',
                controller.getMe,
            );
            expect(guards).toBeDefined();
        });
    });

    describe('POST /auth/forgot-password', () => {
        const requestPasswordResetDto = {
            email: 'test@example.com',
        };

        it('should successfully request password reset', async () => {
            const mockResponse = {
                success: true,
                email: 'test@example.com',
                message: 'A reset link has been sent',
            };
            mockAuthService.forgotPassword.mockResolvedValue(mockResponse);

            const result = await controller.requestPasswordReset(
                requestPasswordResetDto,
                'en',
                '127.0.0.1',
            );

            expect(result).toEqual(mockResponse);
            expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(
                'test@example.com',
                'en',
                '127.0.0.1',
            );
        });

        it('should pass IP address to service', async () => {
            const mockResponse = {
                success: true,
                message: 'If an account exists, a reset link has been sent',
            };
            mockAuthService.forgotPassword.mockResolvedValue(mockResponse);

            await controller.requestPasswordReset(
                requestPasswordResetDto,
                'en',
                '192.168.1.1',
            );

            expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(
                'test@example.com',
                'en',
                '192.168.1.1',
            );
        });
    });

    describe('POST /auth/reset-password', () => {
        const resetPasswordDto = {
            token: 'valid-reset-token',
            newPassword: 'newPassword123',
            confirmPassword: 'newPassword123',
        };

        it('should successfully reset password', async () => {
            const mockResponse = {
                success: true,
                message: 'Password has been reset successfully',
            };
            mockAuthService.resetPassword.mockResolvedValue(mockResponse);

            const result = await controller.resetPassword(resetPasswordDto);

            expect(result).toEqual(mockResponse);
            expect(mockAuthService.resetPassword).toHaveBeenCalledWith(
                'valid-reset-token',
                'newPassword123',
                'newPassword123',
            );
        });

        it('should handle password reset errors', async () => {
            mockAuthService.resetPassword.mockRejectedValue(
                new Error('Invalid token'),
            );

            await expect(controller.resetPassword(resetPasswordDto)).rejects.toThrow(
                'Invalid token',
            );
        });
    });

    describe('GET /auth/validate-reset-token', () => {
        it('should return valid true for valid token', async () => {
            mockAuthService.validateResetToken.mockResolvedValue(true);

            const result = await controller.validateResetToken('valid-token');

            expect(result).toEqual({ valid: true });
            expect(mockAuthService.validateResetToken).toHaveBeenCalledWith(
                'valid-token',
            );
        });

        it('should return valid false for invalid token', async () => {
            mockAuthService.validateResetToken.mockResolvedValue(false);

            const result = await controller.validateResetToken('invalid-token');

            expect(result).toEqual({ valid: false });
            expect(mockAuthService.validateResetToken).toHaveBeenCalledWith(
                'invalid-token',
            );
        });
    });
});
