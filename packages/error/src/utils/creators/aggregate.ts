import { AggregateError, type AggregateErrorOptions, type CustomError } from '../../error';

/**
 * Creates an error that groups multiple errors.
 * @param message - The summary error message.
 * @param errors - An array of errors.
 * @param options - Optional cause and context.
 * @returns An AggregateError instance.
 */
export function aggregateError(message: string, errors: CustomError[], options?: Omit<AggregateErrorOptions, 'message' | 'errors'>): AggregateError {
  return new AggregateError({ message, errors, ...options });
}
