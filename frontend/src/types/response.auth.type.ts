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
  email: string;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}
