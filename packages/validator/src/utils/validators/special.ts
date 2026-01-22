/**
 * Special validators for specific data types
 */

import { ERROR_CODES } from "../../constants";
import type { Validator, ValidationResult } from "../../types";
import { failure, success } from "../../utils";

export function nullValue(): Validator<null> {
  return (value: unknown): ValidationResult<null> => {
    if (value !== null) {
      return failure("Value must be null", ERROR_CODES.CUSTOM);
    }
    return success(null);
  };
}

export function undefinedValue(): Validator<undefined> {
  return (value: unknown): ValidationResult<undefined> => {
    if (value !== undefined) {
      return failure("Value must be undefined", ERROR_CODES.CUSTOM);
    }
    return success(undefined);
  };
}

export function nil(): Validator<null | undefined> {
  return (value: unknown): ValidationResult<null | undefined> => {
    if (value !== null && value !== undefined) {
      return failure("Value must be null or undefined", ERROR_CODES.CUSTOM);
    }
    return success(value as null | undefined);
  };
}

export function defined<T>(): Validator<T> {
  return (value: unknown): ValidationResult<T> => {
    if (value === null || value === undefined) {
      return failure("Value must be defined", ERROR_CODES.REQUIRED);
    }
    return success(value as T);
  };
}

export function symbol(): Validator<symbol> {
  return (value: unknown): ValidationResult<symbol> => {
    if (typeof value !== "symbol") {
      return failure("Value must be a symbol", ERROR_CODES.INVALID_TYPE);
    }
    return success(value);
  };
}

export function bigInt(): Validator<bigint> {
  return (value: unknown): ValidationResult<bigint> => {
    if (typeof value !== "bigint") {
      return failure("Value must be a bigint", ERROR_CODES.INVALID_TYPE);
    }
    return success(value);
  };
}

export function promise<T>(): Validator<Promise<T>> {
  return (value: unknown): ValidationResult<Promise<T>> => {
    if (!(value instanceof Promise)) {
      return failure("Value must be a promise", ERROR_CODES.INVALID_TYPE);
    }
    return success(value as Promise<T>);
  };
}

export function error(): Validator<Error> {
  return (value: unknown): ValidationResult<Error> => {
    if (!(value instanceof Error)) {
      return failure("Value must be an Error", ERROR_CODES.INVALID_TYPE);
    }
    return success(value);
  };
}

export function date(): Validator<Date> {
  return (value: unknown): ValidationResult<Date> => {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      return failure("Value must be a valid date", ERROR_CODES.INVALID_TYPE);
    }
    return success(value);
  };
}

export function regexp(): Validator<RegExp> {
  return (value: unknown): ValidationResult<RegExp> => {
    if (!(value instanceof RegExp)) {
      return failure("Value must be a regular expression", ERROR_CODES.INVALID_TYPE);
    }
    return success(value);
  };
}

export function buffer(): Validator<Buffer> {
  return (value: unknown): ValidationResult<Buffer> => {
    if (typeof Buffer !== 'undefined' && !(value instanceof Buffer)) {
      return failure("Value must be a Buffer", ERROR_CODES.INVALID_TYPE);
    }
    return success(value as Buffer);
  };
}

export function arrayBuffer(): Validator<ArrayBuffer> {
  return (value: unknown): ValidationResult<ArrayBuffer> => {
    if (!(value instanceof ArrayBuffer)) {
      return failure("Value must be an ArrayBuffer", ERROR_CODES.INVALID_TYPE);
    }
    return success(value);
  };
}

export function dataView(): Validator<DataView> {
  return (value: unknown): ValidationResult<DataView> => {
    if (!(value instanceof DataView)) {
      return failure("Value must be a DataView", ERROR_CODES.INVALID_TYPE);
    }
    return success(value);
  };
}

export function typedArray<T extends ArrayBufferView>(): Validator<T> {
  return (value: unknown): ValidationResult<T> => {
    if (!ArrayBuffer.isView(value)) {
      return failure("Value must be a typed array", ERROR_CODES.INVALID_TYPE);
    }
    return success(value as T);
  };
}

export function instanceOf<T>(constructor: new (...args: unknown[]) => T): Validator<T> {
  return (value: unknown): ValidationResult<T> => {
    if (!(value instanceof constructor)) {
      return failure(`Value must be an instance of ${constructor.name}`, ERROR_CODES.INVALID_TYPE);
    }
    return success(value);
  };
}

export function classOf<T extends abstract new (...args: unknown[]) => unknown>(_constructor: T): Validator<T> {
  return (value: unknown): ValidationResult<T> => {
    if (typeof value !== "function") {
      return failure("Value must be a class", ERROR_CODES.INVALID_TYPE);
    }
    return success(value as T);
  };
}
