"use client";

import { useState, useEffect, ReactNode } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/store/store";
import { initializeAuth, markInitialized } from "@/store/slices/auth-slice";
import { authApi } from "@/lib/auth-api";
import { GlobalLoadingProvider } from "@/providers/GlobalLoadingProvider";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          // Fetch user data from API
          const userData = await authApi.getProfile(token);
          store.dispatch(
            initializeAuth({
              token,
              user: userData,
            })
          );
        } catch (error) {
          // If token is invalid, clear it and mark as initialized
          localStorage.removeItem("access_token");
          store.dispatch(markInitialized());
        }
      } else {
        // Mark as initialized even if no token exists
        store.dispatch(markInitialized());
      }
    };

    initAuth();
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GlobalLoadingProvider>{children}</GlobalLoadingProvider>
      </QueryClientProvider>
    </Provider>
  );
}
