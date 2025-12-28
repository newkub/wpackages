import { ConflictError, type ConflictErrorOptions } from '../../error';

/**
 * Creates a conflict error.
 * @param message - The error message.
 * @param options - Optional conflicting resource, cause, and context.
 * @returns A ConflictError instance.
 */
export function conflictError(message: string, options?: Omit<ConflictErrorOptions, 'message'>): ConflictError {
  return new ConflictError({ message, ...options });
}

