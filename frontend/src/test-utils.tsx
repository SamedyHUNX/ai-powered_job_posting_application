import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore, PreloadedState } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import authReducer from '@/store/slices/auth-slice'

// Create a custom render function that includes providers
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: PreloadedState<RootState>
    store?: ReturnType<typeof makeStore>
}

export interface RootState {
    auth: ReturnType<typeof authReducer>
}

export function makeStore(preloadedState?: PreloadedState<RootState>) {
    return configureStore({
        reducer: {
            auth: authReducer,
        },
        preloadedState,
    })
}

export function renderWithProviders(
    ui: ReactElement,
    {
        preloadedState,
        store = makeStore(preloadedState),
        ...renderOptions
    }: ExtendedRenderOptions = {},
) {
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

    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </Provider>
        )
    }

    return {
        store,
        queryClient,
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    }
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
export { renderWithProviders as render }
