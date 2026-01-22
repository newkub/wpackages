/**
 * Numeric validators (extended number validation)
 */

import { ERROR_CODES } from "../../constants";
import type { Validator, ValidationResult } from "../../types";
import { failure, success } from "../../utils";

// Cache error code for performance
const INVALID_TYPE_ERROR = "INVALID_TYPE";

export function numeric(): Validator<string | number> {
  return (value: unknown): ValidationResult<string | number> => {
    const type = typeof value;
    if (type === "number") {
      return value === value ? { success: true, data: value } : { success: false, error: { path: [], message: "Value must be numeric", code: INVALID_TYPE_ERROR } };
    }
    if (type === "string") {
      const num = Number(value);
      return num === num ? { success: true, data: value } : { success: false, error: { path: [], message: "Value must be numeric", code: INVALID_TYPE_ERROR } };
    }
    return { success: false, error: { path: [], message: "Value must be numeric", code: INVALID_TYPE_ERROR } };
  };
}

export function integer(): Validator<number> {
  return (value: unknown): ValidationResult<number> => {
    if (typeof value !== "number" || value !== value || (value | 0) !== value) {
      return { success: false, error: { path: [], message: "Value must be an integer", code: INVALID_TYPE_ERROR } };
    }
    return { success: true, data: value };
  };
}

export function float(): Validator<number> {
  return (value: unknown): ValidationResult<number> => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return failure("Value must be a number", ERROR_CODES.INVALID_TYPE);
    }
    return success(value);
  };
}

export function even(): Validator<number> {
  return (value: unknown): ValidationResult<number> => {
    if (typeof value !== "number" || Number.isNaN(value) || !Number.isInteger(value)) {
      return failure("Value must be an integer", ERROR_CODES.INVALID_TYPE);
    }
    if (value % 2 !== 0) {
      return failure("Value must be even", ERROR_CODES.CUSTOM);
    }
    return success(value);
  };
}

export function odd(): Validator<number> {
  return (value: unknown): ValidationResult<number> => {
    if (typeof value !== "number" || Number.isNaN(value) || !Number.isInteger(value)) {
      return failure("Value must be an integer", ERROR_CODES.INVALID_TYPE);
    }
    if (value % 2 === 0) {
      return failure("Value must be odd", ERROR_CODES.CUSTOM);
    }
    return success(value);
  };
}

export function divisibleBy(divisor: number): Validator<number> {
  return (value: unknown): ValidationResult<number> => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return failure("Value must be a number", ERROR_CODES.INVALID_TYPE);
    }
    if (divisor === 0) {
      return failure("Divisor cannot be zero", ERROR_CODES.CUSTOM);
    }
    if (value % divisor !== 0) {
      return failure(`Value must be divisible by ${divisor}`, ERROR_CODES.CUSTOM);
    }
    return success(value);
  };
}

export function finite(): Validator<number> {
  return (value: unknown): ValidationResult<number> => {
    if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
      return failure("Value must be a finite number", ERROR_CODES.INVALID_TYPE);
    }
    return success(value);
  };
}

export function safeInteger(): Validator<number> {
  return (value: unknown): ValidationResult<number> => {
    if (typeof value !== "number" || Number.isNaN(value) || !Number.isSafeInteger(value)) {
      return failure("Value must be a safe integer", ERROR_CODES.INVALID_TYPE);
    }
    return success(value);
  };
}
