import { ForbiddenError, type ForbiddenErrorOptions } from '../../error';

/**
 * Creates a forbidden error.
 * @param message - The error message.
 * @param options - Optional action, resource, cause, and context.
 * @returns A ForbiddenError instance.
 */
export function forbiddenError(message: string, options?: Omit<ForbiddenErrorOptions, 'message'>): ForbiddenError {
  return new ForbiddenError({ message, ...options });
}

