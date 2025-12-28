import { NetworkError, type NetworkErrorOptions } from '../../error';

/**
 * Creates a network error.
 * @param message - The error message.
 * @param options - Optional URL, cause, and context.
 * @returns A NetworkError instance.
 */
export function networkError(message: string, options?: Omit<NetworkErrorOptions, 'message'>): NetworkError {
  return new NetworkError({ message, ...options });
}

