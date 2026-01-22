/**
 * Function validators
 */

import { ERROR_CODES } from "../../constants";
import type { Validator, ValidationResult } from "../../types";
import { failure, success } from "../../utils";

export function func(): Validator<Function> {
  return (value: unknown): ValidationResult<Function> => {
    if (typeof value !== "function") {
      return failure("Value must be a function", ERROR_CODES.INVALID_TYPE);
    }
    return success(value);
  };
}

export function asyncFunction(): Validator<(...args: unknown[]) => Promise<unknown>> {
  return (value: unknown): ValidationResult<(...args: unknown[]) => Promise<unknown>> => {
    if (typeof value !== "function") {
      return failure("Value must be a function", ERROR_CODES.INVALID_TYPE);
    }
    if (value.constructor.name !== "AsyncFunction") {
      return failure("Value must be an async function", ERROR_CODES.INVALID_TYPE);
    }
    return success(value as (...args: unknown[]) => Promise<unknown>);
  };
}

export function syncFunction(): Validator<(...args: unknown[]) => unknown> {
  return (value: unknown): ValidationResult<(...args: unknown[]) => unknown> => {
    if (typeof value !== "function") {
      return failure("Value must be a function", ERROR_CODES.INVALID_TYPE);
    }
    if (value.constructor.name === "AsyncFunction") {
      return failure("Value must be a synchronous function", ERROR_CODES.INVALID_TYPE);
    }
    return success(value as (...args: unknown[]) => unknown);
  };
}

export function generatorFunction(): Validator<(...args: unknown[]) => Generator> {
  return (value: unknown): ValidationResult<(...args: unknown[]) => Generator> => {
    if (typeof value !== "function") {
      return failure("Value must be a function", ERROR_CODES.INVALID_TYPE);
    }
    if (value.constructor.name !== "GeneratorFunction") {
      return failure("Value must be a generator function", ERROR_CODES.INVALID_TYPE);
    }
    return success(value as (...args: unknown[]) => Generator);
  };
}

export function arity(expectedArity: number): Validator<Function> {
  return (value: unknown): ValidationResult<Function> => {
    if (typeof value !== "function") {
      return failure("Value must be a function", ERROR_CODES.INVALID_TYPE);
    }
    if (value.length !== expectedArity) {
      return failure(`Function must have ${expectedArity} parameters`, ERROR_CODES.CUSTOM);
    }
    return success(value);
  };
}

export function returns<T>(_returnValidator: Validator<T>): Validator<(...args: unknown[]) => T> {
  return (value: unknown): ValidationResult<(...args: unknown[]) => T> => {
    if (typeof value !== "function") {
      return failure("Value must be a function", ERROR_CODES.INVALID_TYPE);
    }
    
    // We can't validate the return type without calling the function
    // This is a type-level validator only
    return success(value as (...args: unknown[]) => T);
  };
}
