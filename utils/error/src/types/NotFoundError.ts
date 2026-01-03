import { Data } from "effect";

/**
 * Represents an error for resource not found.
 * Defaults to a 404 Not Found status code.
 */
export class NotFoundError extends Data.TaggedError("NotFoundError")<{ message: string; isOperational?: boolean }> {
	get statusCode(): number {
		return 404;
	}
}
