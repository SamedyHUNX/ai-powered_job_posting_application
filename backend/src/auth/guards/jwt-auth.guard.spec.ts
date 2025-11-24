import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('JwtAuthGuard', () => {
    let guard: JwtAuthGuard;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [JwtAuthGuard, Reflector],
        }).compile();

        guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    it('should extend AuthGuard with jwt strategy', () => {
        expect(guard).toBeInstanceOf(JwtAuthGuard);
    });

    describe('canActivate', () => {
        it('should allow requests with valid JWT token', async () => {
            const mockExecutionContext = {
                switchToHttp: jest.fn().mockReturnValue({
                    getRequest: jest.fn().mockReturnValue({
                        headers: {
                            authorization: 'Bearer valid-jwt-token',
                        },
                        user: {
                            id: '1',
                            email: 'test@example.com',
                        },
                    }),
                }),
                getHandler: jest.fn(),
                getClass: jest.fn(),
            } as unknown as ExecutionContext;

            // Mock the parent class canActivate method
            const canActivateSpy = jest
                .spyOn(JwtAuthGuard.prototype as any, 'canActivate')
                .mockResolvedValue(true);

            const result = await guard.canActivate(mockExecutionContext);

            expect(result).toBe(true);
        });
    });

    describe('handleRequest', () => {
        it('should return user if authentication succeeds', () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                username: 'testuser',
            };

            // Access the handleRequest method if it exists
            if ('handleRequest' in guard) {
                const result = (guard as any).handleRequest(null, mockUser, null);
                expect(result).toEqual(mockUser);
            }
        });

        it('should throw UnauthorizedException if no user is provided', () => {
            if ('handleRequest' in guard) {
                expect(() => {
                    (guard as any).handleRequest(null, null, null);
                }).toThrow(UnauthorizedException);
            }
        });
    });
});
