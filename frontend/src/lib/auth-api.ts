import axios from "axios";
import { env } from "@/data/env/client";
import { ApiError } from "./api-error";

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
  signIn: async (credentials: SignInRequest): Promise<AuthResponse> => {
    try {
      const { data } = await api.post<AuthResponse>("/auth/signin", credentials);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error("Invalid credentials");
      }
      throw error;
    }
  },

  signUp: async (formData: FormData): Promise<AuthResponse> => {
    try {
      const { data } = await api.post<AuthResponse>("/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Signup failed";
        throw new ApiError(error.response?.status || 500, message);
      }
      throw error;
    }
  },

  getProfile: async (token: string) => {
    try {
      const { data } = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error("Failed to fetch profile");
      }
      throw error;
    }
  },

  requestPasswordReset: async (email: string): Promise<ForgotPasswordResponse> => {
    try {
      const { data } = await api.post<ForgotPasswordResponse>(
        "/auth/forgot-password",
        { email }
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Password reset request failed";
        throw new ApiError(error.response?.status || 500, message);
      }
      throw error;
    }
  },

  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<ForgotPasswordResponse> => {
    try {
      const { data } = await api.post<ForgotPasswordResponse>(
        "/auth/reset-password",
        { token, newPassword }
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Password reset failed";
        throw new ApiError(error.response?.status || 500, message);
      }
      throw error;
    }
  },
};
