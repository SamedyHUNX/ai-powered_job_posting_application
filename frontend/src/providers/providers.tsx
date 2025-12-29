"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/store/store";
import { setAuth, markInitialized } from "@/store/slices/auth-slice";
import { authApi } from "@/lib/auth-api";
import { GlobalLoadingProvider } from "@/providers/global-loading-provider";
import axios from "axios";

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

  // Use ref to track if auth has been initialized to prevent re-initialization on remount
  const hasInitialized = useRef(false);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    // Prevent re-initialization if already done
    if (hasInitialized.current) {
      console.log("[Auth] Already initialized, skipping");
      return;
    }

    const initAuth = async () => {
      console.log("[Auth] Initializing authentication...");
      const token = localStorage.getItem("access_token");

      if (token) {
        console.log("[Auth] Token found in localStorage, validating...");
        try {
          // Fetch user data from API
          const userData = await authApi.getProfile(token);
          console.log("[Auth] Token validated successfully");
          store.dispatch(
            setAuth({
              token,
              user: userData,
            })
          );
        } catch (error) {
          // Only clear token on authentication errors (401/403), not network issues
          if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            if (status === 401 || status === 403) {
              console.warn("[Auth] Token is invalid (401/403), clearing...");
              localStorage.removeItem("access_token");
            } else {
              console.error("[Auth] Network or server error during validation:", status || "unknown");
              // Don't clear token on network errors - keep it for retry
            }
          } else {
            console.error("[Auth] Unexpected error during validation:", error);
          }
          store.dispatch(markInitialized());
        }
      } else {
        console.log("[Auth] No token found");
        // Mark as initialized even if no token exists
        store.dispatch(markInitialized());
      }

      // Mark as initialized to prevent re-runs
      hasInitialized.current = true;
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
