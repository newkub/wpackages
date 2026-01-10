import { Schema } from "@effect/schema";

export type TokenType =
	| "command"
	| "argument"
	| "pipe"
	| "redirect_in"
	| "redirect_out"
	| "redirect_append"
	| "and"
	| "or"
	| "semicolon"
	| "variable"
	| "string"
	| "subcommand";

export class Token extends Schema.Class<Token>("Token")({
	type: Schema.Union(
		Schema.Literal("command"),
		Schema.Literal("argument"),
		Schema.Literal("pipe"),
		Schema.Literal("redirect_in"),
		Schema.Literal("redirect_out"),
		Schema.Literal("redirect_append"),
		Schema.Literal("and"),
		Schema.Literal("or"),
		Schema.Literal("semicolon"),
		Schema.Literal("variable"),
		Schema.Literal("string"),
		Schema.Literal("subcommand"),
	),
	value: Schema.String,
	position: Schema.Tuple([Schema.Number, Schema.Number]),
}) {}
