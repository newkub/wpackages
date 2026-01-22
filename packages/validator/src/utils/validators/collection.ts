/**
 * Collection validators (arrays, objects, maps, sets)
 */

import { ERROR_CODES } from "../../constants";
import type { Validator, ValidationResult } from "../../types";
import { isError } from "../../types";
import { failure, success } from "../../utils";

export function array<T>(itemValidator?: Validator<T>): Validator<T[]> {
  return (value: unknown): ValidationResult<T[]> => {
    if (!Array.isArray(value)) {
      return failure("Value must be an array", ERROR_CODES.INVALID_TYPE);
    }
    
    if (itemValidator) {
      for (let i = 0; i < value.length; i++) {
        const result = itemValidator(value[i]);
        if (isError(result)) {
          const error = result.error;
          return failure(
            `Array item at index ${i} is invalid: ${error.message}`,
            error.code,
            [...error.path, i.toString()]
          );
        }
      }
    }
    
    return success(value);
  };
}

export function set<T>(itemValidator?: Validator<T>): Validator<Set<T>> {
  return (value: unknown): ValidationResult<Set<T>> => {
    if (!(value instanceof Set)) {
      return failure("Value must be a Set", ERROR_CODES.INVALID_TYPE);
    }
    
    if (itemValidator) {
      let index = 0;
      for (const item of value) {
        const result = itemValidator(item);
        if (isError(result)) {
          const error = result.error;
          return failure(
            `Set item at index ${index} is invalid: ${error.message}`,
            error.code,
            [...error.path, index.toString()]
          );
        }
        index++;
      }
    }
    
    return success(value);
  };
}

export function map<K, V>(keyValidator?: Validator<K>, valueValidator?: Validator<V>): Validator<Map<K, V>> {
  return (value: unknown): ValidationResult<Map<K, V>> => {
    if (!(value instanceof Map)) {
      return failure("Value must be a Map", ERROR_CODES.INVALID_TYPE);
    }
    
    if (keyValidator || valueValidator) {
      for (const [key, val] of value) {
        if (keyValidator) {
          const keyResult = keyValidator(key);
          if (isError(keyResult)) {
            const error = keyResult.error;
            return failure(
              `Map key is invalid: ${error.message}`,
              error.code,
              error.path
            );
          }
        }
        
        if (valueValidator) {
          const valResult = valueValidator(val);
          if (isError(valResult)) {
            const error = valResult.error;
            return failure(
              `Map value for key ${String(key)} is invalid: ${error.message}`,
              error.code,
              error.path
            );
          }
        }
      }
    }
    
    return success(value);
  };
}

export function nonEmpty<T extends Array<unknown> | Set<unknown> | Map<unknown, unknown>>(): Validator<T> {
  return (value: unknown): ValidationResult<T> => {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return failure("Array must not be empty", ERROR_CODES.REQUIRED);
      }
    } else if (value instanceof Set) {
      if (value.size === 0) {
        return failure("Set must not be empty", ERROR_CODES.REQUIRED);
      }
    } else if (value instanceof Map) {
      if (value.size === 0) {
        return failure("Map must not be empty", ERROR_CODES.REQUIRED);
      }
    } else {
      return failure("Value must be a collection", ERROR_CODES.INVALID_TYPE);
    }
    
    return success(value as T);
  };
}

export function size<T extends Array<unknown> | Set<unknown> | Map<unknown, unknown>>(expectedSize: number): Validator<T> {
  return (value: unknown): ValidationResult<T> => {
    let actualSize: number;
    
    if (Array.isArray(value)) {
      actualSize = value.length;
    } else if (value instanceof Set) {
      actualSize = value.size;
    } else if (value instanceof Map) {
      actualSize = value.size;
    } else {
      return failure("Value must be a collection", ERROR_CODES.INVALID_TYPE);
    }
    
    if (actualSize !== expectedSize) {
      return failure(`Collection must have exactly ${expectedSize} items`, ERROR_CODES.INVALID_LENGTH);
    }
    
    return success(value as T);
  };
}

export function minSize<T extends Array<unknown> | Set<unknown> | Map<unknown, unknown>>(minSize: number): Validator<T> {
  return (value: unknown): ValidationResult<T> => {
    let actualSize: number;
    
    if (Array.isArray(value)) {
      actualSize = value.length;
    } else if (value instanceof Set) {
      actualSize = value.size;
    } else if (value instanceof Map) {
      actualSize = value.size;
    } else {
      return failure("Value must be a collection", ERROR_CODES.INVALID_TYPE);
    }
    
    if (actualSize < minSize) {
      return failure(`Collection must have at least ${minSize} items`, ERROR_CODES.INVALID_LENGTH);
    }
    
    return success(value as T);
  };
}

export function maxSize<T extends Array<unknown> | Set<unknown> | Map<unknown, unknown>>(maxSize: number): Validator<T> {
  return (value: unknown): ValidationResult<T> => {
    let actualSize: number;
    
    if (Array.isArray(value)) {
      actualSize = value.length;
    } else if (value instanceof Set) {
      actualSize = value.size;
    } else if (value instanceof Map) {
      actualSize = value.size;
    } else {
      return failure("Value must be a collection", ERROR_CODES.INVALID_TYPE);
    }
    
    if (actualSize > maxSize) {
      return failure(`Collection must have at most ${maxSize} items`, ERROR_CODES.INVALID_LENGTH);
    }
    
    return success(value as T);
  };
}

export function includes<T>(item: T): Validator<Array<T> | Set<T>> {
  return (value: unknown): ValidationResult<Array<T> | Set<T>> => {
    if (Array.isArray(value)) {
      if (!value.includes(item)) {
        return failure(`Array must include ${JSON.stringify(item)}`, ERROR_CODES.CUSTOM);
      }
    } else if (value instanceof Set) {
      if (!value.has(item)) {
        return failure(`Set must include ${JSON.stringify(item)}`, ERROR_CODES.CUSTOM);
      }
    } else {
      return failure("Value must be an array or Set", ERROR_CODES.INVALID_TYPE);
    }
    
    return success(value);
  };
}

export function excludes<T>(item: T): Validator<Array<T> | Set<T>> {
  return (value: unknown): ValidationResult<Array<T> | Set<T>> => {
    if (Array.isArray(value)) {
      if (value.includes(item)) {
        return failure(`Array must not include ${JSON.stringify(item)}`, ERROR_CODES.CUSTOM);
      }
    } else if (value instanceof Set) {
      if (value.has(item)) {
        return failure(`Set must not include ${JSON.stringify(item)}`, ERROR_CODES.CUSTOM);
      }
    } else {
      return failure("Value must be an array or Set", ERROR_CODES.INVALID_TYPE);
    }
    
    return success(value);
  };
}
