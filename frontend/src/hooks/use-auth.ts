import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setCredentials,
  logout as logoutAction,
  setUser,
} from "@/store/auth-slice";
import { authApi, SignInRequest } from "@/lib/auth-api";
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
      dispatch(setCredentials({ token: data.token }));
      dispatch(setUser(data.user));
      localStorage.setItem("access_token", data.token);
      router.push("/");
    },
  });

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: (data: FormData) => authApi.signUp(data),
    onSuccess: (data) => {
      dispatch(setCredentials({ token: data.token }));
      dispatch(setUser(data.user));
      localStorage.setItem("access_token", data.token);
      router.push("/");
    },
  });

  // Logout
  const logout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("access_token");
    queryClient.clear();
    router.push("/auth/signin");
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
