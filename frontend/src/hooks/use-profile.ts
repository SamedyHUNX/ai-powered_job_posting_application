import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { authApi } from "@/lib/auth-api";
import { logout } from "@/store/auth-slice";
import { useEffect } from "react";

export function useProfile() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile", token],
    queryFn: () => authApi.getProfile(token!),
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (error) {
      dispatch(logout());
      localStorage.removeItem("access_token");
    }
  }, [error, dispatch]);

  return {
    profile: data,
    isLoading,
    error,
  };
}
