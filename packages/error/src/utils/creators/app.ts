import { AppError, type CustomErrorOptions } from '../../error';

/**
 * Creates an application-specific error.
 * @param message - The error message.
 * @param options - Optional cause and context.
 * @returns An AppError instance.
 */
export function appError(message: string, options?: CustomErrorOptions): AppError {
  return new AppError({ message, ...options });
}
