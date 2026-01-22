/**
 * Array validators
 */

import { ERROR_CODES } from "../../constants";
import type { ValidationResult, Validator } from "../../types";
import { failure, success } from "../../utils";

export function arrayNonEmpty<T>(): Validator<readonly T[]> {
	return (value: unknown): ValidationResult<readonly T[]> => {
		if (!Array.isArray(value)) {
			return failure("Value must be an array", ERROR_CODES.INVALID_TYPE);
		}
		if (value.length === 0) {
			return failure("Array must not be empty", ERROR_CODES.REQUIRED);
		}
		return success(value);
	};
}

export function minItems<T>(min: number): Validator<readonly T[]> {
	return (value: unknown): ValidationResult<readonly T[]> => {
		if (!Array.isArray(value)) {
			return failure("Value must be an array", ERROR_CODES.INVALID_TYPE);
		}
		if (value.length < min) {
			return failure(`Minimum ${min} items required`, ERROR_CODES.INVALID_LENGTH);
		}
		return success(value);
	};
}

export function maxItems<T>(max: number): Validator<readonly T[]> {
	return (value: unknown): ValidationResult<readonly T[]> => {
		if (!Array.isArray(value)) {
			return failure("Value must be an array", ERROR_CODES.INVALID_TYPE);
		}
		if (value.length > max) {
			return failure(`Maximum ${max} items allowed`, ERROR_CODES.INVALID_LENGTH);
		}
		return success(value);
	};
}

export function exactItems<T>(count: number): Validator<readonly T[]> {
	return (value: unknown): ValidationResult<readonly T[]> => {
		if (!Array.isArray(value)) {
			return failure("Value must be an array", ERROR_CODES.INVALID_TYPE);
		}
		if (value.length !== count) {
			return failure(`Array must have exactly ${count} items`, ERROR_CODES.INVALID_LENGTH);
		}
		return success(value);
	};
}

export function unique<T>(): Validator<readonly T[]> {
	return (value: unknown): ValidationResult<readonly T[]> => {
		if (!Array.isArray(value)) {
			return failure("Value must be an array", ERROR_CODES.INVALID_TYPE);
		}
		const unique = new Set(value);
		if (unique.size !== value.length) {
			return failure("Array must contain unique items", ERROR_CODES.CUSTOM);
		}
		return success(value);
	};
}
