import { Data } from "effect";

export class ScriptError extends Data.TaggedError("ScriptError")<{
	readonly message: string;
	readonly scriptPath?: string;
	readonly cause?: unknown;
}> {}
