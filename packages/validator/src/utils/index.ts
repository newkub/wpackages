/**
 * Validation utility functions
 */

import type { ValidationError, ValidationResult } from "../types";

export function success<T>(data: T): ValidationResult<T> {
  return { success: true, data };
}

export function failure(message: string, code: string, path: readonly string[] = []): ValidationResult<never> {
  return { success: false, error: { path, message, code } };
}

export function formatError(error: ValidationError): string {
  const path = error.path.length > 0 ? `Path: ${error.path.join(".")} - ` : "";
  return `${path}${error.message}`;
}
