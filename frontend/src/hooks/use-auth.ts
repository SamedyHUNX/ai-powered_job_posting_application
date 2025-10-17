import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials, logout as logoutAction } from "@/store/auth-slice";
import { authApi, SignInRequest, SignUpRequest } from "@/lib/auth-api";
import { useRouter } from "next/navigation";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const queryClient = useQueryClient();
  const router = useRouter();

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: (credentials: SignInRequest) => authApi.signIn(credentials),
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }));
      localStorage.setItem("access_token", data.token);
      router.push("/");
    },
  });

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: (data: SignUpRequest) => authApi.signUp(data),
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }));
      router.push("/");
    },
  });

  // Logout
  const logout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("access_token");
    queryClient.clear();
    router.push("/auth/login");
  };

  return {
    user,
    token,
    isAuthenticated,
    signIn: signInMutation.mutate,
    signUp: signUpMutation.mutate,
    logout,
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    signInError: signInMutation.error,
    signUpError: signUpMutation.error,
  };
}
