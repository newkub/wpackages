/**
 * Number validators
 */

import { ERROR_CODES } from "../../constants";
import type { Validator, ValidationResult } from "../../types";
import { failure, success } from "../../utils";

export function min(minValue: number): Validator<number> {
  return (value: unknown): ValidationResult<number> => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return failure("Value must be a number", ERROR_CODES.INVALID_TYPE);
    }
    if (value < minValue) {
      return failure(`Minimum value is ${minValue}`, ERROR_CODES.INVALID_RANGE);
    }
    return success(value);
  };
}

export function max(maxValue: number): Validator<number> {
  return (value: unknown): ValidationResult<number> => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return failure("Value must be a number", ERROR_CODES.INVALID_TYPE);
    }
    if (value > maxValue) {
      return failure(`Maximum value is ${maxValue}`, ERROR_CODES.INVALID_RANGE);
    }
    return success(value);
  };
}

export function positive(): Validator<number> {
  return (value: unknown): ValidationResult<number> => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return failure("Value must be a number", ERROR_CODES.INVALID_TYPE);
    }
    if (value <= 0) {
      return failure("Value must be positive", ERROR_CODES.INVALID_RANGE);
    }
    return success(value);
  };
}

export function negative(): Validator<number> {
  return (value: unknown): ValidationResult<number> => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return failure("Value must be a number", ERROR_CODES.INVALID_TYPE);
    }
    if (value >= 0) {
      return failure("Value must be negative", ERROR_CODES.INVALID_RANGE);
    }
    return success(value);
  };
}

export function integer(): Validator<number> {
  return (value: unknown): ValidationResult<number> => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return failure("Value must be a number", ERROR_CODES.INVALID_TYPE);
    }
    if (!Number.isInteger(value)) {
      return failure("Value must be an integer", ERROR_CODES.INVALID_TYPE);
    }
    return success(value);
  };
}

export function finite(): Validator<number> {
  return (value: unknown): ValidationResult<number> => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return failure("Value must be a number", ERROR_CODES.INVALID_TYPE);
    }
    if (!Number.isFinite(value)) {
      return failure("Value must be finite", ERROR_CODES.INVALID_TYPE);
    }
    return success(value);
  };
}

export function range(minValue: number, maxValue: number): Validator<number> {
  return (value: unknown): ValidationResult<number> => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return failure("Value must be a number", ERROR_CODES.INVALID_TYPE);
    }
    if (value < minValue || value > maxValue) {
      return failure(`Value must be between ${minValue} and ${maxValue}`, ERROR_CODES.INVALID_RANGE);
    }
    return success(value);
  };
}

export function multipleOf(factor: number): Validator<number> {
  return (value: unknown): ValidationResult<number> => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return failure("Value must be a number", ERROR_CODES.INVALID_TYPE);
    }
    if (value % factor !== 0) {
      return failure(`Value must be a multiple of ${factor}`, ERROR_CODES.INVALID_RANGE);
    }
    return success(value);
  };
}
