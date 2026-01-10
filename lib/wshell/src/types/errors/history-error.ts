import { Data } from "effect";

export class HistoryError extends Data.TaggedError("HistoryError")<{
	readonly message: string;
	readonly cause?: unknown;
}> {}
