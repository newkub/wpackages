import { Schema, literal } from "@effect/schema";

export class ParsedCommand extends Schema.Class<ParsedCommand>("ParsedCommand")({
	name: Schema.String,
	args: Schema.Array(Schema.String),
	pipes: Schema.optionalWith(Schema.Array(Schema.String), { default: () => [] }),
	redirects: Schema.optionalWith(
		Schema.Array(
			Schema.Struct({
				type: Schema.Union(literal("in"), literal("out"), literal("append")),
				file: Schema.String,
			}),
		),
		{ default: () => [] },
	),
	chaining: Schema.optionalWith(
		Schema.Array(
			Schema.Struct({
				type: Schema.Union(literal("and"), literal("or"), literal("semicolon")),
				command: Schema.String,
			}),
		),
		{ default: () => [] },
	),
	variables: Schema.optionalWith(Schema.Record(Schema.String, Schema.String), { default: () => ({}) }),
}) {}
