import type { Result, Schema } from "../../../types/core";
import { createSchema } from "../../core/schema";

// Enum schema
export function enum_<T extends Record<string, string | number>>(enumObj: T): Schema<T[keyof T]> {
	const values = Object.values(enumObj);

	return createSchema("enum", (value): Result<T[keyof T]> => {
		if (!values.includes(value as any)) {
			return {
				success: false,
				error: {
					path: [],
					message: `Expected one of ${values.map((v) => JSON.stringify(v)).join(", ")}, got ${JSON.stringify(value)}`,
					code: "invalid_enum",
				},
			};
		}
		return { success: true, data: value as T[keyof T] };
	});
}
