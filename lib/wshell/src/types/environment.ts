import { Schema } from "@effect/schema";

export class EnvironmentVariable extends Schema.Class<EnvironmentVariable>("EnvironmentVariable")({
	name: Schema.String,
	value: Schema.String,
	readonly: Schema.optionalWith(Schema.Boolean, { default: () => false }),
}) {}
