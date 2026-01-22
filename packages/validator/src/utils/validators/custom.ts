/**
 * Custom validators
 */

import { ERROR_CODES } from "../../constants";
import type { Validator, ValidationResult } from "../../types";
import { failure, success } from "../../utils";

export function custom<T>(validator: (value: unknown) => boolean | string, message?: string): Validator<T> {
	return (value: unknown): ValidationResult<T> => {
		const result = validator(value);
		if (typeof result === "string") {
			return failure(result, ERROR_CODES.CUSTOM);
		}
		if (!result) {
			return failure(message || "Custom validation failed", ERROR_CODES.CUSTOM);
		}
		return success(value as T);
	};
}

export function oneOf<T>(values: readonly T[]): Validator<T> {
	return (value: unknown): ValidationResult<T> => {
		if (!values.includes(value as T)) {
			return failure(`Value must be one of: ${values.join(", ")}`, ERROR_CODES.INVALID_ENUM);
		}
		return success(value as T);
	};
}

export function notOneOf<T>(values: readonly T[]): Validator<T> {
	return (value: unknown): ValidationResult<T> => {
		if (values.includes(value as T)) {
			return failure(`Value must not be one of: ${values.join(", ")}`, ERROR_CODES.CUSTOM);
		}
		return success(value as T);
	};
}

export function matches<T>(expected: T): Validator<T> {
	return (value: unknown): ValidationResult<T> => {
		if (value !== expected) {
			return failure(`Value must be ${JSON.stringify(expected)}`, ERROR_CODES.CUSTOM);
		}
		return success(value as T);
	};
}

export function required<T>(): Validator<T> {
	return (value: unknown): ValidationResult<T> => {
		if (value === undefined || value === null) {
			return failure("Value is required", ERROR_CODES.REQUIRED);
		}
		return success(value as T);
	};
}

export function optional<T>(validator: (value: unknown) => ValidationResult<T>): Validator<T | undefined> {
	return (value: unknown): ValidationResult<T | undefined> => {
		if (value === undefined) {
			return success(undefined);
		}
		return validator(value);
	};
}

export function nullable<T>(validator: (value: unknown) => ValidationResult<T>): Validator<T | null> {
	return (value: unknown): ValidationResult<T | null> => {
		if (value === null) {
			return success(null);
		}
		return validator(value);
	};
}
