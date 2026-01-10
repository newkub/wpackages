import { Schema } from "@effect/schema";
import { Command } from "@wpackages/command";

export type HookType = "before" | "after" | "error";

export class Hook extends Schema.Class<Hook>("Hook")({
	type: Schema.Union(
		Schema.Literal("before"),
		Schema.Literal("after"),
		Schema.Literal("error"),
	),
	name: Schema.String,
	handler: Schema.String,
	command: Schema.optional(Schema.String),
}) {}

export class HookContext extends Schema.Class<HookContext>("HookContext")({
	command: Schema.instanceOf(Command),
	env: Schema.Record(Schema.String, Schema.String),
}) {}
