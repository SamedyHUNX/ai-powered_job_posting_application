export enum ResponseCode {
  // Success codes (0xxx)
  SUCCESS = 0,
  SIGNUP_SUCCESS = 1,
  SIGNIN_SUCCESS = 2,
  SIGNOUT_SUCCESS = 3,
  EMAIL_VERIFIED = 4,
  PASSWORD_RESET_SENT = 5,
  PASSWORD_RESET_SUCCESS = 6,
  PROFILE_UPDATED = 7,
  ACCOUNT_DELETED = 8,
  EMAIL_VERIFICATION_SENT = 9,

  // Service errors (1xxx)
  SERVICE_UNAVAILABLE = 1001,
  DATABASE_ERROR = 1002,
  REDIS_ERROR = 1003,
  S3_ERROR = 1004,

  // Validation errors (2xxx)
  MISSING_FIELDS = 2001,
  INVALID_CREDENTIALS = 2002,
  PASSWORDS_DO_NOT_MATCH = 2003,
  INVALID_EMAIL_FORMAT = 2004,
  INVALID_PASSWORD_FORMAT = 2005,

  // Conflict errors (3xxx)
  EXISTING_EMAIL = 3001,
  EXISTING_USERNAME = 3002,
  MISSING_PHOTO = 3003,

  // Auth errors (4xxx)
  INVALID_TOKEN = 4001,
  EXPIRED_TOKEN = 4002,
  USER_BANNED = 4003,
  USER_DISABLED = 4004,
  USER_NOT_VERIFIED = 4005,
  TOKEN_INVALIDATED = 4006,

  // Rate limiting (5xxx)
  TOO_MANY_REQUESTS = 5001,
  RATE_LIMIT_EXCEEDED = 5002,
}

export const RESPONSE_MESSAGES: Record<ResponseCode, string> = {
  // Success codes
  [ResponseCode.SUCCESS]: 'Operation completed successfully',
  [ResponseCode.SIGNUP_SUCCESS]:
    'User signed up successfully. Please verify your email.',
  [ResponseCode.SIGNIN_SUCCESS]: 'Signed in successfully',
  [ResponseCode.SIGNOUT_SUCCESS]: 'Signed out successfully',
  [ResponseCode.EMAIL_VERIFIED]: 'Email has been verified successfully',
  [ResponseCode.PASSWORD_RESET_SENT]:
    'A reset link has been sent to your email',
  [ResponseCode.PASSWORD_RESET_SUCCESS]: 'Password has been reset successfully',
  [ResponseCode.PROFILE_UPDATED]: 'Profile updated successfully',
  [ResponseCode.ACCOUNT_DELETED]: 'Account deleted successfully',
  [ResponseCode.EMAIL_VERIFICATION_SENT]:
    'Verification email sent successfully',

  // Service errors
  [ResponseCode.SERVICE_UNAVAILABLE]:
    'Service temporarily unavailable. Please try again later.',
  [ResponseCode.DATABASE_ERROR]:
    'Database connection error. Please try again later.',
  [ResponseCode.REDIS_ERROR]: 'Cache service error. Please try again later.',
  [ResponseCode.S3_ERROR]:
    'File storage service error. Please try again later.',

  // Validation errors
  [ResponseCode.MISSING_FIELDS]: 'Missing required fields',
  [ResponseCode.INVALID_CREDENTIALS]: 'Invalid credentials',
  [ResponseCode.PASSWORDS_DO_NOT_MATCH]: 'Passwords do not match',
  [ResponseCode.INVALID_EMAIL_FORMAT]: 'Invalid email format',
  [ResponseCode.INVALID_PASSWORD_FORMAT]:
    'Password must be at least 8 characters',

  // Conflict errors
  [ResponseCode.EXISTING_EMAIL]: 'User with this email already exists',
  [ResponseCode.EXISTING_USERNAME]: 'Username is already taken',
  [ResponseCode.MISSING_PHOTO]: 'Profile image is required',

  // Auth errors
  [ResponseCode.INVALID_TOKEN]: 'Invalid or expired token',
  [ResponseCode.EXPIRED_TOKEN]: 'Token has expired',
  [ResponseCode.USER_BANNED]: 'User is banned',
  [ResponseCode.USER_DISABLED]: 'User is disabled',
  [ResponseCode.USER_NOT_VERIFIED]: 'User is not verified',
  [ResponseCode.TOKEN_INVALIDATED]: 'Token has been invalidated',

  // Rate limiting
  [ResponseCode.TOO_MANY_REQUESTS]: 'Too many requests from this IP',
  [ResponseCode.RATE_LIMIT_EXCEEDED]:
    'Rate limit exceeded. Please try again later.',
};

export interface ApiResponse<T = any> {
  status: string;
  code: ResponseCode;
  message: string;
  data?: T;
  field?: string;
  details?: any;
}

// Success response helper
export interface SuccessResponse<T = any> {
  status: string;
  code: ResponseCode;
  message: string;
  data?: T;
}

// Error response helper
export interface ErrorResponse {
  status: string;
  code: ResponseCode;
  message: string;
  field?: string;
  details?: any;
}

export class ResponseHelper {
  // Create success response
  static success<T = any>(
    code: ResponseCode,
    data?: T,
    customMessage?: string,
  ): SuccessResponse<T> {
    return {
      status: 'success',
      code,
      message: customMessage || RESPONSE_MESSAGES[code],
      ...(data !== undefined && { data }),
    };
  }

  // Create error response
  static error(
    code: ResponseCode,
    field?: string,
    details?: any,
    customMessage?: string,
  ): ErrorResponse {
    return {
      status: 'error',
      code,
      message: customMessage || RESPONSE_MESSAGES[code],
      ...(field && { field }),
      ...(details && { details }),
    };
  }

  // Get message by code
  static getMessage(code: ResponseCode): string {
    return RESPONSE_MESSAGES[code] || 'An unexpected error occurred';
  }

  // Check if code is success
  static isSuccess(code: ResponseCode): boolean {
    return code >= 0 && code < 1000;
  }

  // Check if code is error
  static isError(code: ResponseCode): boolean {
    return code >= 1000;
  }
}
