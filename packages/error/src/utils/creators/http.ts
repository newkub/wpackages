import { HttpError, type HttpErrorOptions, type CustomErrorOptions } from '../../error';

/**
 * Creates an HTTP error.
 * @param status - The HTTP status code.
 * @param message - The error message.
 * @param options - Optional status text, cause, and context.
 * @returns An HttpError instance.
 */
export function httpError(status: number, message: string, options?: Omit<HttpErrorOptions, 'message' | 'status'>): HttpError {
  return new HttpError({ status, message, ...options });
}

/**
 * Creates a 400 Bad Request error.
 * @param message - The error message.
 * @param options - Optional cause and context.
 * @returns An HttpError instance.
 */
export function badRequestError(message: string, options?: CustomErrorOptions): HttpError {
  return httpError(400, message, { statusText: 'Bad Request', ...options });
}

/**
 * Creates a 500 Internal Server Error.
 * @param message - The error message.
 * @param options - Optional cause and context.
 * @returns An HttpError instance.
 */
export function internalServerError(message: string, options?: CustomErrorOptions): HttpError {
  return httpError(500, message, { statusText: 'Internal Server Error', ...options });
}

