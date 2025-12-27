import * as Schema from "@effect/schema/Schema";
import { BORDER_STYLES } from "../constant/border.const";
import { COLORS } from "../constant/color.const";

// Schema for padding
const PaddingSchema = Schema.struct({
	top: Schema.optional(Schema.number),
	bottom: Schema.optional(Schema.number),
	left: Schema.optional(Schema.number),
	right: Schema.optional(Schema.number),
});

// Schema for Box component props
export const BoxPropsSchema: Schema.Schema<{
	readonly flexDirection?:
		| "row"
		| "column"
		| "row-reverse"
		| "column-reverse"
		| undefined;
	readonly justifyContent?:
		| "flex-start"
		| "center"
		| "flex-end"
		| "space-between"
		| "space-around"
		| undefined;
	readonly alignItems?:
		| "flex-start"
		| "center"
		| "flex-end"
		| "stretch"
		| undefined;
	readonly width?: number | string | undefined;
	readonly height?: number | string | undefined;
	readonly flexGrow?: number | undefined;
	readonly padding?:
		| {
				readonly top?: number | undefined;
				readonly bottom?: number | undefined;
				readonly left?: number | undefined;
				readonly right?: number | undefined;
		  }
		| undefined;
	readonly borderStyle?: keyof typeof BORDER_STYLES | undefined;
	readonly borderColor?: keyof typeof COLORS | undefined;
}> = Schema.struct({
	// Layout
	flexDirection: Schema.optional(
		Schema.literal("row", "column", "row-reverse", "column-reverse"),
	),
	justifyContent: Schema.optional(
		Schema.literal(
			"flex-start",
			"center",
			"flex-end",
			"space-between",
			"space-around",
		),
	),
	alignItems: Schema.optional(
		Schema.literal("flex-start", "center", "flex-end", "stretch"),
	),
	width: Schema.optional(Schema.union(Schema.number, Schema.string)),
	height: Schema.optional(Schema.union(Schema.number, Schema.string)),
	flexGrow: Schema.optional(Schema.number),

	// Styling
	padding: Schema.optional(PaddingSchema),
	borderStyle: Schema.optional(
		Schema.literal(
			...(Object.keys(BORDER_STYLES) as Array<keyof typeof BORDER_STYLES>),
		),
	),
	borderColor: Schema.optional(
		Schema.literal(...(Object.keys(COLORS) as Array<keyof typeof COLORS>)),
	),
});

export type BoxProps = Schema.Schema.To<typeof BoxPropsSchema>;

// Schema for Text component props
export const TextPropsSchema: Schema.Schema<{
	readonly color?: keyof typeof COLORS | undefined;
	readonly bold?: boolean | undefined;
	readonly italic?: boolean | undefined;
}> = Schema.struct({
	color: Schema.optional(
		Schema.literal(...(Object.keys(COLORS) as Array<keyof typeof COLORS>)),
	),
	bold: Schema.optional(Schema.boolean),
	italic: Schema.optional(Schema.boolean),
});

export type TextProps = Schema.Schema.To<typeof TextPropsSchema>;
