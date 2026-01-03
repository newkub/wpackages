import { Data } from "effect";

/**
 * Represents an error for resource conflicts.
 * Defaults to a 409 Conflict status code.
 */
export class ConflictError extends Data.TaggedError("ConflictError")<{ message: string; isOperational?: boolean }> {
	get statusCode(): number {
		return 409;
	}
}
