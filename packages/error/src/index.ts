/**
 * @wrikka/error - Type-safe, class-based error handling for TypeScript.
 *
 * Inspired by Rust's error handling, this library provides a robust and flexible
 * way to manage errors in your applications.
 *
 * @example
 * ```ts
 * import { notFoundError, match, type NotFoundError } from '@wts/error';
 * import { err, ok, type Result } from '@wts/functional';
 *
 * function findUser(id: number): Result<{ id: number; name: string }, NotFoundError> {
 *   if (id !== 1) {
 *     return err(notFoundError('User', { id }));
 *   }
 *   return ok({ id: 1, name: 'Alice' });
 * }
 *
 * const userResult = findUser(2);
 *
 * if (userResult.isErr()) {
 *   const message = match(userResult.error, {
 *     NotFoundError: (e) => `Resource '${e.resource}' with ID '${e.id}' not found.`,
 *     _: (e) => `An unexpected error occurred: ${e.message}`
 *   });
 *   console.log(message); // "Resource 'User' with ID '2' not found."
 * }
 * ```
 */

export * from './error';
export * from './utils';


