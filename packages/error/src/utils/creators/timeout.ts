import { TimeoutError, type TimeoutErrorOptions } from '../../error';

/**
 * Creates a timeout error.
 * @param message - The error message.
 * @param options - Timeout duration and optional cause and context.
 * @returns A TimeoutError instance.
 */
export function timeoutError(message: string, options: Omit<TimeoutErrorOptions, 'message'>): TimeoutError {
  return new TimeoutError({ message, ...options });
}
