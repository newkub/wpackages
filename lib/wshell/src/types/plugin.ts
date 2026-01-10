import { Schema } from "@effect/schema";

export class Plugin extends Schema.Class<Plugin>("Plugin")({
	name: Schema.String,
	version: Schema.String,
	path: Schema.String,
	enabled: Schema.optionalWith(Schema.Boolean, { default: () => true }),
}) {}
