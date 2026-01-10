import { Schema } from "@effect/schema";

export class Script extends Schema.Class<Script>("Script")({
	path: Schema.String,
	content: Schema.String,
	args: Schema.optionalWith(Schema.Array(Schema.String), { default: () => [] }),
}) {}
