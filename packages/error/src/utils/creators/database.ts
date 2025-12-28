import { DatabaseError, type DatabaseErrorOptions } from '../../error';

/**
 * Creates a database error.
 * @param message - The error message.
 * @param options - Optional query, table, cause, and context.
 * @returns A DatabaseError instance.
 */
export function databaseError(message: string, options?: Omit<DatabaseErrorOptions, 'message'>): DatabaseError {
  return new DatabaseError({ message, ...options });
}

