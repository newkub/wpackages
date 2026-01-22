/**
 * Core types for validators
 */

export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; error: ValidationError };

export interface ValidationError {
  path: readonly string[];
  message: string;
  code: string;
}

export type Validator<T> = (value: unknown) => ValidationResult<T>;

export function isSuccess<T>(result: ValidationResult<T>): result is { success: true; data: T } {
  return result.success === true;
}

export function isError<T>(result: ValidationResult<T>): result is { success: false; error: ValidationError } {
  return result.success === false;
}
