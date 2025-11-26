import { InternalServerErrorException } from '@nestjs/common';

export function catchAsync<T>(
  fn: (...args: any[]) => Promise<T>,
  logger: { error: (msg: string) => void },
  errorMessage = 'Failed to process request',
) {
  return async (...args: any[]): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error: any) {
      logger.error(`Error: ${error.message}`);
      throw new InternalServerErrorException({
        code: 'FETCH_ERROR',
        message: errorMessage,
      });
    }
  };
}
