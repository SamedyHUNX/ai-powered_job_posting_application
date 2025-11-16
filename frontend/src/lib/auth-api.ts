import axios from "axios";
import { env } from "@/data/env/client";

const API_URL = env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
  };
  token: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

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

  getProfile: async (token: string) => {
    const { data } = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const { data } = await api.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      { email }
    );
    return data;
  },

  resetPassword: async (
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<ForgotPasswordResponse> => {
    const { data } = await api.post<ForgotPasswordResponse>(
      "/auth/reset-password",
      { token, newPassword, confirmPassword }
    );
    return data;
  },
};
