/**
 * String validators
 */

import { ERROR_CODES, REGEX_PATTERNS } from "../../constants";
import type { Validator, ValidationResult } from "../../types";
import { failure, success } from "../../utils";

export function email(): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    if (!REGEX_PATTERNS.EMAIL.test(value)) {
      return failure("Invalid email format", ERROR_CODES.INVALID_EMAIL);
    }
    return success(value);
  };
}

export function url(): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    try {
      new URL(value);
      return success(value);
    } catch {
      return failure("Invalid URL format", ERROR_CODES.INVALID_URL);
    }
  };
}

export function uuid(): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    if (!REGEX_PATTERNS.UUID.test(value)) {
      return failure("Invalid UUID format", ERROR_CODES.INVALID_UUID);
    }
    return success(value);
  };
}

export function minLength(min: number): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    if (value.length < min) {
      return failure(`Minimum length is ${min}`, ERROR_CODES.INVALID_LENGTH);
    }
    return success(value);
  };
}

export function maxLength(max: number): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    if (value.length > max) {
      return failure(`Maximum length is ${max}`, ERROR_CODES.INVALID_LENGTH);
    }
    return success(value);
  };
}

export function pattern(regex: RegExp): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    if (!regex.test(value)) {
      return failure(`Value does not match pattern ${regex.source}`, ERROR_CODES.INVALID_PATTERN);
    }
    return success(value);
  };
}

export function stringNonEmpty(): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    if (value.length === 0) {
      return failure("String must not be empty", ERROR_CODES.REQUIRED);
    }
    return success(value);
  };
}

export function trim(): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    return success(value.trim());
  };
}
