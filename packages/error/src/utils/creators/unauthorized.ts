import { UnauthorizedError, type UnauthorizedErrorOptions } from '../../error';

/**
 * Creates an unauthorized error.
 * @param message - The error message.
 * @param options - Optional realm, cause, and context.
 * @returns An UnauthorizedError instance.
 */
export function unauthorizedError(message: string, options?: Omit<UnauthorizedErrorOptions, 'message'>): UnauthorizedError {
  return new UnauthorizedError({ message, ...options });
}

