import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { DrizzleService } from '@/drizzle/drizzle.service';
import { S3Service } from '@/s3/s3.service';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '@/redis/redis.module';
import {
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

// Mock the inngest module
jest.mock('@/inngest/inngest.client', () => ({
  inngest: {
    send: jest.fn().mockResolvedValue({}),
  },
}));

// Mock the password utils
jest.mock('@/drizzle/utils/password.utils', () => ({
  hashPassword: jest.fn((password: string) =>
    Promise.resolve('hashed_' + password),
  ),
}));

// Mock the utils
jest.mock('@/utils/utils', () => ({
  capitalizeString: jest.fn(
    (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
  ),
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let drizzleService: DrizzleService;
  let s3Service: S3Service;
  let redis: Redis;

  const mockDb = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
  };

  const mockRedis = {
    get: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    incr: jest.fn(),
    expire: jest.fn(),
    keys: jest.fn(),
    pipeline: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  const mockS3Service = {
    uploadFile: jest.fn().mockResolvedValue({ Key: 'test-key' }),
  };

  const mockDrizzleService = {
    db: mockDb,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: DrizzleService,
          useValue: mockDrizzleService,
        },
        {
          provide: S3Service,
          useValue: mockS3Service,
        },
        {
          provide: REDIS_CLIENT,
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    drizzleService = module.get<DrizzleService>(DrizzleService);
    s3Service = module.get<S3Service>(S3Service);
    redis = module.get<Redis>(REDIS_CLIENT);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    const mockFile = {
      originalname: 'test.jpg',
      buffer: Buffer.from('test'),
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    const signUpDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'john',
      lastName: 'doe',
    };

    beforeEach(() => {
      // Reset mock implementations
      mockDb.where.mockReturnThis();
      mockDb.limit.mockResolvedValue([]);
    });

    it('should successfully create a new user', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'john doe',
        password: 'hashed_password123',
        imageUrl: expect.any(String),
        verificationToken: expect.any(String),
        verificationExpires: expect.any(Date),
      };

      mockDb.limit.mockResolvedValue([]); // No existing user
      mockDb.returning.mockResolvedValue([mockUser]);

      const result = await service.signUp(signUpDto, mockFile, 'en');

      expect(result).toEqual({ success: true });
      expect(mockS3Service.uploadFile).toHaveBeenCalledWith(
        mockFile,
        expect.stringContaining('users/avatars/'),
      );
      expect(mockDb.insert).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      mockDb.limit.mockResolvedValue([
        { email: 'test@example.com', username: 'otheruser' },
      ]);

      await expect(service.signUp(signUpDto, mockFile, 'en')).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if username already exists', async () => {
      mockDb.limit.mockResolvedValue([
        { email: 'other@example.com', username: 'testuser' },
      ]);

      await expect(service.signUp(signUpDto, mockFile, 'en')).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if file is missing', async () => {
      mockDb.limit.mockResolvedValue([]);

      await expect(
        service.signUp(signUpDto, null as any, 'en'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('signIn', () => {
    const signInDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashed_password123',
      imageUrl: 'https://example.com/image.jpg',
      isVerified: true,
      isBanned: false,
      isDisabled: false,
      tokenVersion: 0,
    };

    beforeEach(() => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockRedis.get.mockResolvedValue(null);
    });

    it('should successfully sign in a user', async () => {
      mockDb.limit.mockResolvedValue([mockUser]);

      const result = await service.signIn(signInDto);

      expect(result).toEqual({
        success: true,
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          imageUrl: mockUser.imageUrl,
        },
        token: 'mock-jwt-token',
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
        tokenVersion: mockUser.tokenVersion,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockDb.limit.mockResolvedValue([]);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockDb.limit.mockResolvedValue([mockUser]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user is not verified', async () => {
      mockDb.limit.mockResolvedValue([{ ...mockUser, isVerified: false }]);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user is banned', async () => {
      mockDb.limit.mockResolvedValue([{ ...mockUser, isBanned: true }]);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user is disabled', async () => {
      mockDb.limit.mockResolvedValue([{ ...mockUser, isDisabled: true }]);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should use cached user if available', async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify(mockUser));

      const result = await service.signIn(signInDto);

      expect(result.success).toBe(true);
      expect(mockDb.select).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if email or password is missing', async () => {
      await expect(
        service.signIn({ email: '', password: 'test' }),
      ).rejects.toThrow(ConflictException);

      await expect(
        service.signIn({ email: 'test@example.com', password: '' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('verifyEmail', () => {
    const mockToken = 'valid-token';
    const mockHashedToken = crypto
      .createHash('sha256')
      .update(mockToken)
      .digest('hex');

    const mockUser = {
      id: '1',
      email: 'test@example.com',
      verificationToken: mockHashedToken,
      verificationExpires: new Date(Date.now() + 3600000), // 1 hour from now
    };

    it('should successfully verify email with valid token', async () => {
      mockDb.limit.mockResolvedValue([mockUser]);
      mockDb.set.mockReturnThis();

      const result = await service.verifyEmail(mockToken);

      expect(result).toEqual({
        success: true,
        message: 'Email has been verified successfully',
      });
      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.set).toHaveBeenCalledWith({
        isVerified: true,
        verificationToken: null,
        verificationExpires: null,
      });
    });

    it('should throw UnauthorizedException with invalid token', async () => {
      mockDb.limit.mockResolvedValue([]);

      await expect(service.verifyEmail('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException with expired token', async () => {
      // Mock should return empty array for expired token (query filters by date)
      mockDb.limit.mockResolvedValue([]);

      await expect(service.verifyEmail(mockToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('forgotPassword', () => {
    const email = 'test@example.com';
    const ipAddress = '127.0.0.1';

    const mockUser = {
      id: '1',
      email,
      resetPasswordExpires: null,
    };

    beforeEach(() => {
      mockRedis.incr.mockResolvedValue(1);
      mockRedis.expire.mockResolvedValue(1);
    });

    it('should successfully send password reset email', async () => {
      mockDb.limit.mockResolvedValue([mockUser]);

      const result = await service.forgotPassword(email, 'en', ipAddress);

      expect(result).toEqual({
        success: true,
        email,
        message: 'A reset link has been sent',
      });
      expect(mockDb.update).toHaveBeenCalled();
    });

    it('should return success even if user does not exist (security)', async () => {
      mockDb.limit.mockResolvedValue([]);

      const result = await service.forgotPassword(email, 'en', ipAddress);

      expect(result).toEqual({
        success: true,
        message: 'If an account exists, a reset link has been sent',
      });
    });

    it('should enforce IP rate limiting', async () => {
      mockRedis.incr.mockResolvedValue(11); // Exceeds limit of 10

      await expect(
        service.forgotPassword(email, 'en', ipAddress),
      ).rejects.toThrow(BadRequestException);
    });

    it('should enforce email rate limiting', async () => {
      mockRedis.incr
        .mockResolvedValueOnce(1) // IP check passes
        .mockResolvedValueOnce(4); // Email check fails (exceeds 3)

      const result = await service.forgotPassword(email, 'en', ipAddress);

      expect(result).toEqual({
        success: true,
        message: 'If an account exists, a reset link has been sent',
      });
    });

    it('should not send email if recent token exists', async () => {
      const userWithRecentToken = {
        ...mockUser,
        resetPasswordExpires: new Date(Date.now() + 100000),
      };
      mockDb.limit.mockResolvedValue([userWithRecentToken]);

      const result = await service.forgotPassword(email, 'en', ipAddress);

      expect(result).toEqual({
        success: true,
        message: 'If an account exists, a reset link has been sent',
      });
      expect(mockDb.update).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    const mockToken = 'valid-reset-token';
    const mockHashedToken = crypto
      .createHash('sha256')
      .update(mockToken)
      .digest('hex');

    const mockUser = {
      id: '1',
      email: 'test@example.com',
      resetPasswordToken: mockHashedToken,
      resetPasswordExpires: new Date(Date.now() + 3600000),
      tokenVersion: 0,
    };

    beforeEach(() => {
      mockRedis.del.mockResolvedValue(1);
      mockRedis.keys.mockResolvedValue([]);
      mockRedis.pipeline.mockReturnValue({
        del: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });
    });

    it('should successfully reset password', async () => {
      mockDb.limit.mockResolvedValue([mockUser]);

      const result = await service.resetPassword(
        mockToken,
        'newPassword123',
        'newPassword123',
      );

      expect(result).toEqual({
        success: true,
        message: 'Password has been reset successfully',
      });
      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.set).toHaveBeenCalledWith({
        password: expect.any(String),
        resetPasswordToken: null,
        resetPasswordExpires: null,
        tokenVersion: 1,
      });
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      await expect(
        service.resetPassword(mockToken, 'password1', 'password2'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException with invalid token', async () => {
      mockDb.limit.mockResolvedValue([]);

      await expect(
        service.resetPassword('invalid-token', 'password', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException with expired token', async () => {
      // Mock should return empty array for expired token (query filters by date)
      mockDb.limit.mockResolvedValue([]);

      await expect(
        service.resetPassword(mockToken, 'password', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateResetToken', () => {
    const mockToken = 'valid-reset-token';
    const mockHashedToken = crypto
      .createHash('sha256')
      .update(mockToken)
      .digest('hex');

    it('should return true for valid token', async () => {
      mockDb.limit.mockResolvedValue([{ id: '1' }]);

      const result = await service.validateResetToken(mockToken);

      expect(result).toBe(true);
    });

    it('should return false for invalid token', async () => {
      mockDb.limit.mockResolvedValue([]);

      const result = await service.validateResetToken('invalid-token');

      expect(result).toBe(false);
    });
  });

  describe('validateUser', () => {
    const mockPayload = {
      sub: '1',
      email: 'test@example.com',
      tokenVersion: 0,
    };

    const mockUser = {
      id: '1',
      email: 'test@example.com',
      tokenVersion: 0,
    };

    it('should successfully validate user with valid payload', async () => {
      mockDb.limit.mockResolvedValue([mockUser]);

      const result = await service.validateUser(mockPayload);

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockDb.limit.mockResolvedValue([]);

      await expect(service.validateUser(mockPayload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token version mismatch', async () => {
      mockDb.limit.mockResolvedValue([{ ...mockUser, tokenVersion: 1 }]);

      await expect(service.validateUser(mockPayload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('Service Availability Checks', () => {
    it('should throw InternalServerErrorException if database is not available', async () => {
      const serviceWithoutDb = new AuthService(
        redis,
        jwtService,
        { db: null } as any,
        s3Service,
      );

      await expect(
        serviceWithoutDb.signIn({
          email: 'test@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException if Redis is not available', async () => {
      const serviceWithoutRedis = new AuthService(
        null as any,
        jwtService,
        drizzleService,
        s3Service,
      );

      mockDb.limit.mockResolvedValue([
        {
          id: '1',
          email: 'test@example.com',
          password: 'hashed_password',
          isVerified: true,
          isBanned: false,
          isDisabled: false,
          tokenVersion: 0,
        },
      ]);

      await expect(
        serviceWithoutRedis.signIn({
          email: 'test@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
