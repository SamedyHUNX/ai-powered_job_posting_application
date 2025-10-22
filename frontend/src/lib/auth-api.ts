import { env } from "@/data/env/client";
import { ApiError } from "./api-error";

const API_URL = env.NEXT_PUBLIC_API_URL;

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  firstName: string;
  lastName: string;
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

export const authApi = {
  signIn: async (credentials: SignInRequest): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    return res.json();
  },

  signUp: async (data: SignUpRequest): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      const message = errorData?.message || "Signup failed";
      throw new ApiError(res.status, message);
    }

    return res.json();
  },
  getProfile: async (token: string) => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch profile");
    }

    return res.json();
  },
};
