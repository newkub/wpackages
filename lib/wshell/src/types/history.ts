import { Schema } from "@effect/schema";

export class HistoryEntry extends Schema.Class<HistoryEntry>("HistoryEntry")({
	command: Schema.String,
	timestamp: Schema.Number,
	index: Schema.Number,
}) {}
