/**
 * Boolean validators
 */

import { ERROR_CODES } from "../../constants";
import type { Validator, ValidationResult } from "../../types";
import { failure, success } from "../../utils";

// Cache error codes for performance
const INVALID_TYPE_ERROR = "INVALID_TYPE";

// Cache error object for performance
const INVALID_BOOLEAN_ERROR = { path: [], message: "Value must be a boolean", code: INVALID_TYPE_ERROR } as const;
const TRUE_SUCCESS = { success: true, data: true } as const;
const FALSE_SUCCESS = { success: true, data: false } as const;

export function boolean(): Validator<boolean> {
  return (value: unknown): ValidationResult<boolean> => {
    if (value === true) {
      return TRUE_SUCCESS;
    }
    if (value === false) {
      return FALSE_SUCCESS;
    }
    return { success: false, error: INVALID_BOOLEAN_ERROR };
  };
}

export function trueValue(): Validator<boolean> {
  return (value: unknown): ValidationResult<boolean> => {
    if (value !== true) {
      return failure("Value must be true", ERROR_CODES.CUSTOM);
    }
    return success(true);
  };
}

export function falseValue(): Validator<boolean> {
  return (value: unknown): ValidationResult<boolean> => {
    if (value !== false) {
      return failure("Value must be false", ERROR_CODES.CUSTOM);
    }
    return success(false);
  };
}

export function truthy(): Validator<unknown> {
  return (value: unknown): ValidationResult<unknown> => {
    if (!value) {
      return failure("Value must be truthy", ERROR_CODES.CUSTOM);
    }
    return success(value);
  };
}

export function falsy(): Validator<unknown> {
  return (value: unknown): ValidationResult<unknown> => {
    if (value) {
      return failure("Value must be falsy", ERROR_CODES.CUSTOM);
    }
    return success(value);
  };
}
