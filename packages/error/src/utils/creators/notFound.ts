import { NotFoundError, type NotFoundErrorOptions } from '../../error';

/**
 * Creates a not found error.
 * @param resource - The name of the resource that was not found.
 * @param options - Optional resource ID, cause, and context.
 * @returns A NotFoundError instance.
 */
export function notFoundError(resource: string, options?: Omit<NotFoundErrorOptions, 'message' | 'resource'>): NotFoundError {
  const message = options?.id
    ? `Resource '${resource}' with ID '${options.id}' not found.`
    : `Resource '${resource}' not found.`;
  return new NotFoundError({ resource, message, ...options });
}
