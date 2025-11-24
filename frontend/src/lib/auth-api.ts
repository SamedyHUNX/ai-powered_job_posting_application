import axios from "axios";
import { env } from "@/data/env/client";
import { SignInRequest } from "@/types/request.auth.type";
import {
  AuthResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  VerifyEmailResponse,
} from "@/types/response.auth.type";

const API_URL = env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authApi = {
  // Signin
  signIn: async (credentials: SignInRequest): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/signin", credentials);
    return data;
  },

  // Signup
  signUp: async (formData: FormData, locale: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/signup", formData, {
      headers: {
        "Accept-Language": locale,
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  // Verify Email
  verifyEmail: async (token: string): Promise<VerifyEmailResponse> => {
    const { data } = await api.post<VerifyEmailResponse>("/auth/verify-email", {
      token,
    });
    return data;
  },

  // Get user profile
  getProfile: async (token: string) => {
    const { data } = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  forgotPassword: async (
    email: string,
    locale: string
  ): Promise<ForgotPasswordResponse> => {
    const { data } = await api.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      { email },
      {
        headers: {
          "Accept-Language": locale,
        },
      }
    );
    return data;
  },

  resetPassword: async (
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<ResetPasswordResponse> => {
    const { data } = await api.post<ResetPasswordResponse>(
      "/auth/reset-password",
      { token, newPassword, confirmPassword }
    );
    return data;
  },
};
