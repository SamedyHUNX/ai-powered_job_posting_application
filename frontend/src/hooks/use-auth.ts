import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setCredentials,
  logout as logoutAction,
  setUser,
} from "@/store/slices/auth-slice";
import { authApi } from "@/lib/auth-api";
import { useRouter } from "next/navigation";
import { ResetPasswordFormData } from "@/schemas/auth/resetPasswordSchema";
import { SignInRequest } from "@/types/request.auth.type";
import { useLocale } from "next-intl";
import {
  clearOrganizations,
  setError,
  setSuccess,
} from "@/store/slices/organizations-slice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth
  );
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: (credentials: SignInRequest) => authApi.signIn(credentials),
    onSuccess: (data) => {
      dispatch(setCredentials({ token: data.token }));
      dispatch(setUser(data.user));
      dispatch(setSuccess(data.message));
      localStorage.setItem("access_token", data.token);

      router.push(`/${locale}`);
    },
    onError: (err: any) => {
      dispatch(setError({ message: err.message, code: err.code }));
    },
  });

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: ({
      formData,
      locale,
    }: {
      formData: FormData;
      locale: string;
    }) => authApi.signUp(formData, locale),
    onSuccess: () => {
      router.push("/auth/signin");
    },
  });

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: () => {
      router.push("/auth/signin");
    },
  });

  // Forgot password reset
  const forgotPasswordMutation = useMutation({
    mutationFn: ({ email, locale }: { email: string; locale: string }) =>
      authApi.forgotPassword(email, locale),
    onSuccess: (data) => {
      router.push(
        `/auth/forgot-password/email-sent?email=${encodeURIComponent(
          data.email
        )}`
      );
    },
  });

  // Reset password
  const resetPasswordMutation = useMutation({
    mutationFn: ({
      token,
      newPassword,
      confirmPassword,
    }: { token: string } & ResetPasswordFormData) =>
      authApi.resetPassword(token, newPassword, confirmPassword),
    onSuccess: () => {
      router.push("/auth/signin");
    },
  });

  // Logout
  const logout = () => {
    dispatch(logoutAction());
    dispatch(clearOrganizations());
    localStorage.removeItem("access_token");
    queryClient.clear();
    router.push("/auth/signin");
  };

  return {
    user,
    token,
    isAuthenticated,
    isInitialized,

    // Signin
    signIn: signInMutation.mutate,
    signInSuccess: signInMutation.isSuccess,
    isSigningIn: signInMutation.isPending,
    signInError: signInMutation.error,

    // Signup
    signUp: signUpMutation.mutate,
    signUpSuccess: signUpMutation.isSuccess,
    isSigningUp: signInMutation.isPending,
    signUpError: signUpMutation.error,

    // Verify email
    verifyEmail: verifyEmailMutation.mutate,
    isVerifyingEmail: verifyEmailMutation.isPending,
    verifyEmailError: verifyEmailMutation.error,
    verifyEmailSuccess: verifyEmailMutation.isSuccess,

    // Forgot password
    forgotPassword: forgotPasswordMutation.mutate,
    isRequestingForgotPassword: forgotPasswordMutation.isPending,
    forgotPasswordError: forgotPasswordMutation.error,
    forgotPasswordSuccess: forgotPasswordMutation.isSuccess,

    // Reset password
    resetPassword: resetPasswordMutation.mutate,
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error,
    resetPasswordSuccess: resetPasswordMutation.isSuccess,

    // Signout
    logout,
  };
}
