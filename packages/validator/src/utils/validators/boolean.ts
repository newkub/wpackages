/**
 * Boolean validators
 */

import { ERROR_CODES } from "../../constants";
import type { Validator, ValidationResult } from "../../types";
import { failure, success } from "../../utils";

export function boolean(): Validator<boolean> {
  return (value: unknown): ValidationResult<boolean> => {
    if (typeof value !== "boolean") {
      return failure("Value must be a boolean", ERROR_CODES.INVALID_TYPE);
    }
    return success(value);
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
