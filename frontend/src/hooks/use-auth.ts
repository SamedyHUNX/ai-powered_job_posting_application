import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearAuth,
  selectIsAuthenticated,
  setAuth,
} from "@/store/slices/auth-slice";
import { authApi } from "@/lib/auth-api";
import { useRouter } from "next/navigation";
import { ResetPasswordFormData } from "@/schemas/resetPasswordSchema";
import { useLocale } from "next-intl";
import { clearOrganizations } from "@/store/slices/organizations-slice";
import { AuthResponse } from "@/types";
import { SignInFormData } from "@/schemas";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, isInitialized } = useAppSelector((state) => state.auth);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: (data: SignInFormData) => authApi.signIn(data),
    onSuccess: ({ data }: AuthResponse) => {
      const user = data.users[0];
      dispatch(setAuth({ token: user.token, user }));
      dispatch(clearOrganizations());
      localStorage.setItem("access_token", user.token);
      router.push(`/${locale}`);
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

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: ({ email, locale }: { email: string; locale: string }) =>
      authApi.forgotPassword(email, locale),
    onSuccess: (data) => {
      router.push(
        `/auth/forgot-password/email-sent?email=${encodeURIComponent(
          data.user.email
        )}`
      );
    },
  });

  // Reset password mutation
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
    dispatch(clearOrganizations());
    dispatch(clearAuth());
    localStorage.removeItem("access_token");
    localStorage.removeItem("selectedOrganization");
    queryClient.clear();
    router.push("/auth/signin");
  };

  return {
    // State
    user,
    token,
    isAuthenticated,
    isInitialized,

    // Sign in
    signIn: signInMutation.mutate,
    isSigningIn: signInMutation.isPending,
    signInError: signInMutation.error,
    signInSuccess: signInMutation.isSuccess,

    // Sign up
    signUp: signUpMutation.mutate,
    isSigningUp: signUpMutation.isPending,
    signUpError: signUpMutation.error,
    signUpSuccess: signUpMutation.isSuccess,

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

    // Logout
    logout,
  };
}
