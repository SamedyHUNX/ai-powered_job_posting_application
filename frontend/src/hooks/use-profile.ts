import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { authApi } from "@/lib/auth-api";
import { clearAuth } from "@/store/slices/auth-slice";
import useSWR from "swr";
import { clearOrganizations } from "@/store/slices/organizations-slice";

export function useProfile() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const { data, isLoading, error } = useSWR(
    token ? ["profile", token] : null, // null disables the request when no token
    ([_, token]) => authApi.getProfile(token),
    {
      revalidateOnFocus: false, // Don't refetch on window focus
      shouldRetryOnError: false, // Similar to retry: false in React Query
      onError: () => {
        dispatch(clearOrganizations());
        dispatch(clearAuth());
        localStorage.removeItem("access_token");
      },
    }
  );

  return {
    currentUser: data,
    isFetchingCurrentUser: isLoading,
    currentUserError: error,
  };
}
