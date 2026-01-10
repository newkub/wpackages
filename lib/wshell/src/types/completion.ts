import { Schema } from "@effect/schema";

export type CompletionType = "command" | "argument" | "file" | "env" | "alias";

export class CompletionItem extends Schema.Class<CompletionItem>("CompletionItem")({
	label: Schema.String,
	type: Schema.Union(
		Schema.Literal("command"),
		Schema.Literal("argument"),
		Schema.Literal("file"),
		Schema.Literal("env"),
		Schema.Literal("alias"),
	),
	description: Schema.optional(Schema.String),
	value: Schema.optional(Schema.String),
}) {}
