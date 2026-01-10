import { Schema } from "@effect/schema";

export class ShellConfig extends Schema.Class<ShellConfig>("ShellConfig")({
	theme: Schema.optionalWith(Schema.String, { default: () => "default" }),
	promptStyle: Schema.optionalWith(Schema.String, { default: () => ">" }),
	continuationPrompt: Schema.optionalWith(Schema.String, { default: () => "...>" }),
	historySize: Schema.optionalWith(Schema.Number, { default: () => 1000 }),
	historyFile: Schema.optionalWith(Schema.String, { default: () => "~/.wshell_history" }),
	aliases: Schema.optionalWith(Schema.Record(Schema.String, Schema.String), { default: () => ({}) }),
	envVars: Schema.optionalWith(Schema.Record(Schema.String, Schema.String), { default: () => ({}) }),
	plugins: Schema.optionalWith(Schema.Array(Schema.String), { default: () => [] }),
	hooks: Schema.optionalWith(Schema.Record(Schema.String, Schema.String), { default: () => ({}) }),
}) {}
