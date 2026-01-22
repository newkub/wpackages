/**
 * Object validators
 */

import { ERROR_CODES } from "../../constants";
import type { Validator, ValidationResult } from "../../types";
import { failure, success } from "../../utils";

// Cache error codes for performance
const INVALID_TYPE_ERROR = "INVALID_TYPE";
const REQUIRED_ERROR = "REQUIRED";

export function hasKey<T extends Record<string, unknown>>(key: string): Validator<T> {
  const invalidTypeError = { success: false, error: { path: [], message: "Value must be an object", code: INVALID_TYPE_ERROR } } as const;
  const requiredError = { success: false, error: { path: [], message: `Object must have key "${key}"`, code: REQUIRED_ERROR } } as const;
  return (value: unknown): ValidationResult<T> => {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      return invalidTypeError;
    }
    if (!(key in value)) {
      return requiredError;
    }
    return { success: true, data: value as T };
  };
}

export function requiredKeys<T extends Record<string, unknown>>(...keys: string[]): Validator<T> {
  return (value: unknown): ValidationResult<T> => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return failure("Value must be an object", ERROR_CODES.INVALID_TYPE);
    }
    const missing = keys.filter((key) => !(key in value));
    if (missing.length > 0) {
      return failure(`Object must have keys: ${missing.join(", ")}`, ERROR_CODES.REQUIRED);
    }
    return success(value as T);
  };
}

export function shape<T extends Record<string, unknown>>(schema: Record<string, Validator<unknown>>): Validator<T> {
  return (value: unknown): ValidationResult<T> => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return failure("Value must be an object", ERROR_CODES.INVALID_TYPE);
    }
    const result = value as T;
    for (const [key, validator] of Object.entries(schema)) {
      const validationResult = validator(result[key]);
      if (validationResult.success === false) {
        return failure(validationResult.error.message, validationResult.error.code, [...validationResult.error.path, key]);
      }
    }
    return success(result);
  };
}

export function exactShape<T extends Record<string, unknown>>(schema: Record<string, Validator<unknown>>): Validator<T> {
  return (value: unknown): ValidationResult<T> => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return failure("Value must be an object", ERROR_CODES.INVALID_TYPE);
    }
    const result = value as T;
    const keys = Object.keys(schema);
    const valueKeys = Object.keys(result);
    if (keys.length !== valueKeys.length || !keys.every((key) => key in result)) {
      return failure("Object must have exactly the specified keys", ERROR_CODES.CUSTOM);
    }
    for (const [key, validator] of Object.entries(schema)) {
      const validationResult = validator(result[key]);
      if (validationResult.success === false) {
        return failure(validationResult.error.message, validationResult.error.code, [...validationResult.error.path, key]);
      }
    }
    return success(result);
  };
}
