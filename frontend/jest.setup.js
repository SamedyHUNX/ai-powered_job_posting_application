// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
            pathname: '/',
            query: {},
            asPath: '/',
        }
    },
    usePathname() {
        return '/'
    },
    useSearchParams() {
        return new URLSearchParams()
    },
}))

// Mock next-intl
jest.mock('next-intl', () => ({
    useLocale() {
        return 'en'
    },
    useTranslations() {
        return (key) => key
    },
}))

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock fetch
global.fetch = jest.fn()

// Mock env module
jest.mock('@/data/env/client', () => ({
    env: {
        NEXT_PUBLIC_API_URL: 'http://localhost:3001',
    },
}))
