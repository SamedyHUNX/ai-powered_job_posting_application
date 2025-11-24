import { renderHook, waitFor } from '@testing-library/react'
import { useAuth } from './use-auth'
import { authApi } from '@/lib/auth-api'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import authReducer from '@/store/slices/auth-slice'
import { ReactNode } from 'react'

// Mock authApi
jest.mock('@/lib/auth-api')
const mockedAuthApi = authApi as jest.Mocked<typeof authApi>

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {}

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString()
        },
        removeItem: (key: string) => {
            delete store[key]
        },
        clear: () => {
            store = {}
        },
    }
})()

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
})

// Helper to create wrapper with providers
const createWrapper = (preloadedState?: any) => {
    const store = configureStore({
        reducer: {
            auth: authReducer,
        },
        preloadedState,
    })

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
            mutations: {
                retry: false,
            },
        },
    })

    return ({ children }: { children: ReactNode }) => (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </Provider>
    )
}

describe('useAuth', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        localStorageMock.clear()
    })

    it('should return initial auth state', () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        })

        expect(result.current.user).toBeNull()
        expect(result.current.token).toBeNull()
        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.isInitialized).toBe(false)
    })

    it('should handle successful sign in', async () => {
        const mockResponse = {
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
        }

        mockedAuthApi.signIn = jest.fn().mockResolvedValue(mockResponse)

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        })

        // Trigger sign in
        result.current.signIn({
            email: 'test@example.com',
            password: 'password123',
        })

        await waitFor(() => {
            expect(result.current.signInSuccess).toBe(true)
        })

        // Verify localStorage was called
        expect(localStorageMock.getItem('access_token')).toBe('mock-jwt-token')
    })

    it('should handle sign in error', async () => {
        const mockError = new Error('Invalid credentials')
        mockedAuthApi.signIn = jest.fn().mockRejectedValue(mockError)

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        })

        result.current.signIn({
            email: 'test@example.com',
            password: 'wrongpassword',
        })

        await waitFor(() => {
            expect(result.current.signInError).toBeTruthy()
        })
    })

    it('should handle logout', async () => {
        const preloadedState = {
            auth: {
                user: {
                    id: '1',
                    email: 'test@example.com',
                    name: 'Test User',
                },
                token: 'mock-jwt-token',
                isAuthenticated: true,
                isInitialized: true,
            },
        }

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(preloadedState),
        })

        // Set token in localStorage
        localStorageMock.setItem('access_token', 'mock-jwt-token')

        // Logout
        result.current.logout()

        await waitFor(() => {
            expect(result.current.isAuthenticated).toBe(false)
        })

        // Verify localStorage was cleared
        expect(localStorageMock.getItem('access_token')).toBeNull()
    })

    it('should handle successful sign up', async () => {
        const mockResponse = {
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
        }

        mockedAuthApi.signUp = jest.fn().mockResolvedValue(mockResponse)

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        })

        const formData = new FormData()
        formData.append('email', 'test@example.com')
        formData.append('password', 'password123')

        result.current.signUp({ formData, locale: 'en' })

        await waitFor(() => {
            expect(result.current.signUpSuccess).toBe(true)
        })
    })

    it('should handle verify email', async () => {
        const mockResponse = {
            success: true,
            message: 'Email verified successfully',
        }

        mockedAuthApi.verifyEmail = jest.fn().mockResolvedValue(mockResponse)

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        })

        result.current.verifyEmail('valid-token')

        await waitFor(() => {
            expect(result.current.verifyEmailSuccess).toBe(true)
        })
    })

    it('should handle forgot password', async () => {
        const mockResponse = {
            success: true,
            email: 'test@example.com',
            message: 'Reset link sent',
        }

        mockedAuthApi.forgotPassword = jest.fn().mockResolvedValue(mockResponse)

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        })

        result.current.forgotPassword({ email: 'test@example.com', locale: 'en' })

        await waitFor(() => {
            expect(result.current.forgotPasswordSuccess).toBe(true)
        })
    })

    it('should handle reset password', async () => {
        const mockResponse = {
            success: true,
            message: 'Password reset successfully',
        }

        mockedAuthApi.resetPassword = jest.fn().mockResolvedValue(mockResponse)

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(),
        })

        result.current.resetPassword({
            token: 'reset-token',
            newPassword: 'newPassword123',
            confirmPassword: 'newPassword123',
        })

        await waitFor(() => {
            expect(result.current.resetPasswordSuccess).toBe(true)
        })
    })
})
