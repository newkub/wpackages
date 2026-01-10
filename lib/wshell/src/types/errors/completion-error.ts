import { Data } from "effect";

export class CompletionError extends Data.TaggedError("CompletionError")<{
	readonly message: string;
	readonly cause?: unknown;
}> {}
