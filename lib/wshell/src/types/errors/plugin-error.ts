import { Data } from "effect";

export class PluginError extends Data.TaggedError("PluginError")<{
	readonly message: string;
	readonly pluginName?: string;
	readonly cause?: unknown;
}> {}
