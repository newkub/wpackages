import { Schema } from "@effect/schema";

export class Alias extends Schema.Class<Alias>("Alias")({
	name: Schema.String,
	command: Schema.String,
	description: Schema.optional(Schema.String),
}) {}
