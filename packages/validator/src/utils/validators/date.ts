/**
 * Date validators
 */

import { ERROR_CODES } from "../../constants";
import type { Validator, ValidationResult } from "../../types";
import { failure, success } from "../../utils";

export function minDate(date: Date): Validator<Date> {
  return (value: unknown): ValidationResult<Date> => {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      return failure("Value must be a date", ERROR_CODES.INVALID_TYPE);
    }
    if (value < date) {
      return failure(`Date must be after ${date.toISOString()}`, ERROR_CODES.INVALID_DATE);
    }
    return success(value);
  };
}

export function maxDate(date: Date): Validator<Date> {
  return (value: unknown): ValidationResult<Date> => {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      return failure("Value must be a date", ERROR_CODES.INVALID_TYPE);
    }
    if (value > date) {
      return failure(`Date must be before ${date.toISOString()}`, ERROR_CODES.INVALID_DATE);
    }
    return success(value);
  };
}

export function past(): Validator<Date> {
  return (value: unknown): ValidationResult<Date> => {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      return failure("Value must be a date", ERROR_CODES.INVALID_TYPE);
    }
    if (value >= new Date()) {
      return failure("Date must be in the past", ERROR_CODES.INVALID_DATE);
    }
    return success(value);
  };
}

export function future(): Validator<Date> {
  return (value: unknown): ValidationResult<Date> => {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      return failure("Value must be a date", ERROR_CODES.INVALID_TYPE);
    }
    if (value <= new Date()) {
      return failure("Date must be in the future", ERROR_CODES.INVALID_DATE);
    }
    return success(value);
  };
}

export function today(): Validator<Date> {
  return (value: unknown): ValidationResult<Date> => {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      return failure("Value must be a date", ERROR_CODES.INVALID_TYPE);
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const valueDate = new Date(value);
    valueDate.setHours(0, 0, 0, 0);
    if (valueDate.getTime() !== today.getTime()) {
      return failure("Date must be today", ERROR_CODES.INVALID_DATE);
    }
    return success(value);
  };
}
