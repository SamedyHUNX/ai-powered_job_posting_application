import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { authApi } from "@/lib/auth-api";
import { logout } from "@/store/auth-slice";
import useSWR from "swr";

export function useProfile() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const { data, isLoading, error } = useSWR(
    token ? ["profile", token] : null, // null disables the request when no token
    ([_, token]) => authApi.getProfile(token),
    {
      revalidateOnFocus: false, // Don't refetch on window focus
      shouldRetryOnError: false, // Similar to retry: false in React Query
      onError: (err) => {
        dispatch(logout());
        localStorage.removeItem("access_token");
      },
    }
  );

  return {
    user: data,
    isLoading,
    error,
  };
}
