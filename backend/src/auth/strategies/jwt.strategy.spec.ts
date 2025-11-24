import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
    let strategy: JwtStrategy;
    let authService: AuthService;

    const mockAuthService = {
        validateUser: jest.fn(),
    };

    // Set JWT_SECRET for testing
    const originalEnv = process.env;

    beforeAll(() => {
        process.env = {
            ...originalEnv,
            JWT_SECRET: 'test-secret-key',
        };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        strategy = module.get<JwtStrategy>(JwtStrategy);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(strategy).toBeDefined();
    });

    describe('validate', () => {
        it('should validate and return user with valid payload', async () => {
            const mockPayload = {
                sub: '1',
                email: 'test@example.com',
                tokenVersion: 0,
            };

            const mockUser = {
                id: '1',
                email: 'test@example.com',
                username: 'testuser',
                tokenVersion: 0,
            };

            mockAuthService.validateUser.mockResolvedValue(mockUser);

            const result = await strategy.validate(mockPayload);

            expect(result).toEqual(mockUser);
            expect(mockAuthService.validateUser).toHaveBeenCalledWith(mockPayload);
        });

        it('should throw UnauthorizedException if user validation fails', async () => {
            const mockPayload = {
                sub: '1',
                email: 'test@example.com',
                tokenVersion: 0,
            };

            mockAuthService.validateUser.mockResolvedValue(null);

            await expect(strategy.validate(mockPayload)).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it('should throw UnauthorizedException if validateUser throws', async () => {
            const mockPayload = {
                sub: '999',
                email: 'nonexistent@example.com',
                tokenVersion: 0,
            };

            mockAuthService.validateUser.mockRejectedValue(
                new UnauthorizedException('Invalid credentials'),
            );

            await expect(strategy.validate(mockPayload)).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });

    describe('JWT_SECRET validation', () => {
        it('should throw error if JWT_SECRET is not defined', () => {
            const envWithoutSecret = { ...process.env };
            delete envWithoutSecret.JWT_SECRET;

            // Temporarily replace env
            const originalProcessEnv = process.env;
            process.env = envWithoutSecret;

            expect(() => {
                new JwtStrategy(mockAuthService as any);
            }).toThrow('JWT_SECRET is not defined');

            // Restore env
            process.env = originalProcessEnv;
        });
    });
});
