import { CustomError, AppError, type AnyError } from '../error';

type Matcher<T> = {
  [K in AnyError['name']]?: (error: Extract<AnyError, { name: K }>) => T;
} & { _?: (error: CustomError) => T };

/**
 * Performs pattern matching on an error object.
 * It allows you to handle different error types in a clean and type-safe way.
 *
 * @param error - The error to match against.
 * @param matcher - An object where keys are error names and values are handler functions.
 *                  A special `_` key can be used as a wildcard to catch any unhandled errors.
 * @returns The result of the matched handler.
 * @throws If no handler matches the error and no wildcard `_` is provided.
 *
 * @example
 * const result = match(error, {
 *   NotFoundError: (e) => `Not found: ${e.resource}`,
 *   ValidationError: (e) => `Validation failed on ${e.field}`,
 *   _: () => 'An unknown error occurred',
 * });
 */
export function match<T>(error: unknown, matcher: Matcher<T>): T {
  if (!(error instanceof CustomError)) {
    if (matcher._) {
      // Coerce to a CustomError to pass to the wildcard handler
      const coercedError = new AppError({ message: String(error), cause: error });
      return matcher._(coercedError);
    }
    throw new AppError({ message: 'Matcher exhausted, but no wildcard handler was provided for a non-CustomError value.', cause: error });
  }

  const handler = matcher[error.name as AnyError['name']];

  if (handler) {
    // The type assertion is safe here because we've matched the name
    return handler(error as any);
  }

  if (matcher._) {
    return matcher._(error);
  }

  throw new AppError({ message: 'Matcher exhausted, but no wildcard handler was provided.', cause: error });
}
