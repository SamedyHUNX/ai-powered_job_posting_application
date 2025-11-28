export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    isAdmin: string;
    userRole: string;
  };
  message: string;
  token: string;
}

export interface VerifyEmailResponse {
  code?: string;
  message: string;
}

export interface ForgotPasswordResponse {
  email: string;
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}
