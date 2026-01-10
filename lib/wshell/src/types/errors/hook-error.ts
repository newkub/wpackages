import { Data } from "effect";

export class HookError extends Data.TaggedError("HookError")<{
	readonly message: string;
	readonly hookName?: string;
	readonly cause?: unknown;
}> {}
