import { InternalServerErrorException, HttpException } from '@nestjs/common';

export function catchAsync<T>(
  fn: (...args: any[]) => Promise<T>,
  logger: { error: (msg: string) => void },
  errorMessage = 'Failed to process request',
) {
  return async (...args: any[]): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error: any) {
      // Pass through Nest HTTP exceptions (e.g., UnauthorizedException, ConflictException)
      if (error instanceof HttpException) {
        // Optional: avoid double-logging if already logged inside the handler
        // logger.error(`HTTPException: ${error.message}`);
        throw error;
      }

      // Log unexpected errors and return a standardized 500
      logger.error(`Error: ${error?.message ?? 'Unknown error'}`);
      throw new InternalServerErrorException({
        code: 'FETCH_ERROR',
        message: errorMessage,
      });
    }
  };
}
