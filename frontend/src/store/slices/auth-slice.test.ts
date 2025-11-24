import authReducer, {
    setCredentials,
    setUser,
    initializeAuth,
    markInitialized,
    logout,
    User,
} from './auth-slice'

describe('authSlice', () => {
    const initialState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isInitialized: false,
    }

    const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
    }

    describe('reducers', () => {
        it('should return the initial state', () => {
            expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState)
        })

        it('should handle setCredentials', () => {
            const action = setCredentials({ token: 'mock-jwt-token' })
            const state = authReducer(initialState, action)

            expect(state.token).toBe('mock-jwt-token')
            expect(state.isAuthenticated).toBe(true)
            expect(state.user).toBeNull()
        })

        it('should handle setUser', () => {
            const action = setUser(mockUser)
            const state = authReducer(initialState, action)

            expect(state.user).toEqual(mockUser)
            expect(state.token).toBeNull()
            expect(state.isAuthenticated).toBe(false)
        })

        it('should handle initializeAuth with token only', () => {
            const action = initializeAuth({ token: 'mock-jwt-token' })
            const state = authReducer(initialState, action)

            expect(state.token).toBe('mock-jwt-token')
            expect(state.isAuthenticated).toBe(true)
            expect(state.isInitialized).toBe(true)
            expect(state.user).toBeNull()
        })

        it('should handle initializeAuth with token and user', () => {
            const action = initializeAuth({
                token: 'mock-jwt-token',
                user: mockUser,
            })
            const state = authReducer(initialState, action)

            expect(state.token).toBe('mock-jwt-token')
            expect(state.isAuthenticated).toBe(true)
            expect(state.isInitialized).toBe(true)
            expect(state.user).toEqual(mockUser)
        })

        it('should handle markInitialized', () => {
            const action = markInitialized()
            const state = authReducer(initialState, action)

            expect(state.isInitialized).toBe(true)
            expect(state.isAuthenticated).toBe(false)
            expect(state.user).toBeNull()
            expect(state.token).toBeNull()
        })

        it('should handle logout', () => {
            const authenticatedState = {
                user: mockUser,
                token: 'mock-jwt-token',
                isAuthenticated: true,
                isInitialized: true,
            }

            const action = logout()
            const state = authReducer(authenticatedState, action)

            expect(state.user).toBeNull()
            expect(state.token).toBeNull()
            expect(state.isAuthenticated).toBe(false)
            expect(state.isInitialized).toBe(true) // Stays true
        })

        it('should maintain isInitialized after logout', () => {
            const authenticatedState = {
                user: mockUser,
                token: 'mock-jwt-token',
                isAuthenticated: true,
                isInitialized: true,
            }

            const action = logout()
            const state = authReducer(authenticatedState, action)

            expect(state.isInitialized).toBe(true)
        })
    })

    describe('state transitions', () => {
        it('should handle complete login flow', () => {
            // Start with initial state
            let state = initialState

            // Set credentials
            state = authReducer(state, setCredentials({ token: 'mock-jwt-token' }))
            expect(state.isAuthenticated).toBe(true)

            // Set user
            state = authReducer(state, setUser(mockUser))
            expect(state.user).toEqual(mockUser)

            // Logout
            state = authReducer(state, logout())
            expect(state.isAuthenticated).toBe(false)
            expect(state.user).toBeNull()
            expect(state.token).toBeNull()
        })

        it('should handle initialization flow', () => {
            let state = initialState

            // Initialize with token and user
            state = authReducer(
                state,
                initializeAuth({ token: 'mock-jwt-token', user: mockUser }),
            )

            expect(state.isInitialized).toBe(true)
            expect(state.isAuthenticated).toBe(true)
            expect(state.user).toEqual(mockUser)
            expect(state.token).toBe('mock-jwt-token')
        })

        it('should handle logout after initialization', () => {
            let state = initialState

            // Initialize
            state = authReducer(
                state,
                initializeAuth({ token: 'mock-jwt-token', user: mockUser }),
            )
            expect(state.isAuthenticated).toBe(true)

            // Logout
            state = authReducer(state, logout())
            expect(state.isAuthenticated).toBe(false)
            expect(state.isInitialized).toBe(true) // Still initialized
        })
    })
})
