import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setCredentials,
  logout as logoutAction,
  setUser,
} from "@/store/slices/auth-slice";
import { authApi } from "@/lib/auth-api";
import { useRouter } from "next/navigation";
import { ResetPasswordFormData } from "@/schemas/resetPasswordSchema";
import { useLocale } from "next-intl";
import {
  clearOrganizations,
  setError,
  setSuccess,
} from "@/store/slices/organizations-slice";
import { AuthResponse, AuthRequest } from "@/types";

/**
 * Exposes authentication state, mutation controls, and a logout action for use in components.
 *
 * Provides current auth state (user, token, isAuthenticated, isInitialized, isLoading), mutation
 * functions for sign-in, sign-up, email verification, forgot-password, and reset-password flows,
 * and a logout function. Each mutation surface includes convenience flags and error objects
 * (e.g., isPending/isSuccess and error) to drive UI state.
 *
 * @returns An object containing auth state values, mutation controls and status/error flags for:
 * signIn, signUp, verifyEmail, forgotPassword, resetPassword, and the logout action.
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isInitialized, isLoading } =
    useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: (credentials: Partial<AuthRequest>) =>
      authApi.signIn(credentials),
    onSuccess: ({ data: { user }, message }: AuthResponse) => {
      dispatch(setCredentials({ token: user.token }));
      dispatch(setUser(user));
      dispatch(setSuccess(message));
      dispatch(clearOrganizations());
      localStorage.setItem("access_token", user.token);

      router.push(`/${locale}`);
    },
    onError: (err: any) => {
      const errorData = err.response?.data || {};
      dispatch(
        setError({
          message: errorData.message || err.message,
          code: errorData.code || err.code,
        })
      );
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
    onError: (err: any) => {
      const errorData = err.response?.data || {};
      dispatch(
        setError({
          message: errorData.message || err.message,
          code: errorData.code || err.code,
        })
      );
    },
  });

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: () => {
      router.push("/auth/signin");
    },
    onError: (err: any) => {
      const errorData = err.response?.data || {};
      dispatch(
        setError({
          message: errorData.message || err.message,
          code: errorData.code || err.code,
        })
      );
    },
  });

  // Forgot password reset
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
    onError: (err: any) => {
      const errorData = err.response?.data || {};
      dispatch(
        setError({
          message: errorData.message || err.message,
          code: errorData.code || err.code,
        })
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
    onError: (err: any) => {
      const errorData = err.response?.data || {};
      dispatch(
        setError({
          message: errorData.message || err.message,
          code: errorData.code || err.code,
        })
      );
    },
  });

  // Logout
  const logout = () => {
    dispatch(clearOrganizations());
    dispatch(logoutAction());
    localStorage.removeItem("access_token");
    localStorage.removeItem("selectedOrganization");
    queryClient.clear();
    router.push("/auth/signin");
  };

  return {
    user,
    token,
    isAuthenticated,
    isInitialized,
    isLoading,

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