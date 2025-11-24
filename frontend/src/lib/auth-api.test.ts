// Mock the entire axios module properly
const mockPost = jest.fn()
const mockGet = jest.fn()

// Create mock axios instance BEFORE any imports
const mockAxiosInstance = {
    post: mockPost,
    get: mockGet,
}

// Mock axios module
jest.mock('axios', () => ({
    __esModule: true,
    default: {
        create: jest.fn(() => mockAxiosInstance),
    },
}))

// Import AFTER mock is set up
import { authApi } from './auth-api'

describe('authApi', () => {
    beforeEach(() => {
        mockPost.mockClear()
        mockGet.mockClear()
    })

    describe('signIn', () => {
        it('should successfully sign in with valid credentials', async () => {
            const mockResponse = {
                data: {
                    success: true,
                    user: {
                        id: '1',
                        email: 'test@example.com',
                        name: 'Test User',
                        firstName: 'Test',
                        lastName: 'User',
                        imageUrl: 'https://example.com/image.jpg',
                    },
                    token: 'mock-jwt-token',
                },
            }

            mockPost.mockResolvedValue(mockResponse)

            const credentials = {
                email: 'test@example.com',
                password: 'password123',
            }

            const result = await authApi.signIn(credentials)

            expect(result).toEqual(mockResponse.data)
        })

        it('should throw error on failed signin', async () => {
            const mockError = new Error('Invalid credentials')
            mockPost.mockRejectedValue(mockError)

            const credentials = {
                email: 'test@example.com',
                password: 'wrongpassword',
            }

            await expect(authApi.signIn(credentials)).rejects.toThrow(
                'Invalid credentials',
            )
        })
    })

    describe('signUp', () => {
        it('should successfully sign up with form data', async () => {
            const mockResponse = {
                data: {
                    success: true,
                    user: {
                        id: '1',
                        email: 'test@example.com',
                        name: 'Test User',
                        firstName: 'Test',
                        lastName: 'User',
                        imageUrl: 'https://example.com/image.jpg',
                    },
                    token: 'mock-jwt-token',
                },
            }

            mockPost.mockResolvedValue(mockResponse)

            const formData = new FormData()
            formData.append('email', 'test@example.com')
            formData.append('password', 'password123')

            const result = await authApi.signUp(formData, 'en')

            expect(result).toEqual(mockResponse.data)
        })
    })

    describe('verifyEmail', () => {
        it('should successfully verify email with token', async () => {
            const mockResponse = {
                data: {
                    success: true,
                    message: 'Email verified successfully',
                },
            }

            mockPost.mockResolvedValue(mockResponse)

            const result = await authApi.verifyEmail('valid-token')

            expect(result).toEqual(mockResponse.data)
        })

        it('should throw error on invalid token', async () => {
            const mockError = new Error('Invalid token')
            mockPost.mockRejectedValue(mockError)

            await expect(authApi.verifyEmail('invalid-token')).rejects.toThrow(
                'Invalid token',
            )
        })
    })

    describe('getProfile', () => {
        it('should get user profile with bearer token', async () => {
            const mockResponse = {
                data: {
                    id: '1',
                    email: 'test@example.com',
                    name: 'Test User',
                },
            }

            mockGet.mockResolvedValue(mockResponse)

            const result = await authApi.getProfile('mock-token')

            expect(result).toEqual(mockResponse.data)
        })
    })

    describe('forgotPassword', () => {
        it('should send forgot password request', async () => {
            const mockResponse = {
                data: {
                    success: true,
                    email: 'test@example.com',
                    message: 'Reset link sent',
                },
            }

            mockPost.mockResolvedValue(mockResponse)

            const result = await authApi.forgotPassword('test@example.com', 'en')

            expect(result).toEqual(mockResponse.data)
        })
    })

    describe('resetPassword', () => {
        it('should reset password with token', async () => {
            const mockResponse = {
                data: {
                    success: true,
                    message: 'Password reset successfully',
                },
            }

            mockPost.mockResolvedValue(mockResponse)

            const result = await authApi.resetPassword(
                'reset-token',
                'newPassword123',
                'newPassword123',
            )

            expect(result).toEqual(mockResponse.data)
        })

        it('should handle password reset errors', async () => {
            const mockError = new Error('Passwords do not match')
            mockPost.mockRejectedValue(mockError)

            await expect(
                authApi.resetPassword('token', 'password1', 'password2'),
            ).rejects.toThrow('Passwords do not match')
        })
    })
})
