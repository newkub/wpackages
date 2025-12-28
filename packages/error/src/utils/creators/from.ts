import { AppError } from '../../error';

/**
 * Creates an AppError from an existing Error object.
 * @param error - The original error.
 * @returns An AppError instance.
 */
export function fromError(error: Error): AppError {
  // If it's already an AppError, return it to avoid re-wrapping.
  if (error instanceof AppError) {
    return error;
  }
  return new AppError({ message: error.message, cause: error });
}

/**
 * Creates an AppError from an unknown value.
 * @param value - The unknown value to convert.
 * @returns An AppError instance.
 */
export function fromUnknown(value: unknown): AppError {
	if (value instanceof Error) {
		return fromError(value);
	}

	return new AppError({ message: String(value) });
}
