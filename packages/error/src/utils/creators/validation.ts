import { ValidationError, type ValidationErrorOptions } from '../../error';

/**
 * Creates a validation error.
 * @param message - The error message.
 * @param options - Optional field, value, cause, and context.
 * @returns A ValidationError instance.
 */
export function validationError(message: string, options?: Omit<ValidationErrorOptions, 'message'>): ValidationError {
  return new ValidationError({ message, ...options });
}

