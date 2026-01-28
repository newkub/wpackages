import type { Result, Schema, ValidationError } from "../../../types/core";
import { createSchema } from "../../core/schema";

// Union schema
export function union<T extends readonly [Schema<any>, ...Schema<any>[]]>(
	schemas: T,
): Schema<T[number] extends Schema<infer U> ? U : never> {
	return createSchema("union", (value): Result<T[number] extends Schema<infer U> ? U : never> => {
		const errors: ValidationError[] = [];

		for (const schema of schemas) {
			const result = schema.safeParse(value);
			if (result.success) {
				return result;
			}
			errors.push({
				path: [],
				message: result.error.message,
				code: result.error.code,
			});
		}

		return {
			success: false,
			error: {
				path: [],
				message: "Union validation failed",
				code: "invalid_union",
				issues: errors,
			},
		};
	});
}
