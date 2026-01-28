import type { Result, Schema, ValidationError } from "../../../types/core";
import { createSchema } from "../../core/schema";
import { pushIssues } from "./issue-utils";

// Array schema
export function array<T>(itemSchema: Schema<T>): Schema<T[]> {
	return createSchema("array", (value): Result<T[]> => {
		if (!Array.isArray(value)) {
			return {
				success: false,
				error: {
					path: [],
					message: `Expected array, got ${typeof value}`,
					code: "invalid_type",
				},
			};
		}

		const result: T[] = [];
		const errors: ValidationError[] = [];

		for (let i = 0; i < value.length; i++) {
			const itemResult = itemSchema.safeParse(value[i]);

			if (!itemResult.success) {
				const index = String(i);
				pushIssues(errors, {
					prefixPath: [index],
					error: itemResult.error,
				});
			} else {
				result.push(itemResult.data);
			}
		}

		if (errors.length > 0) {
			return {
				success: false,
				error: {
					path: [],
					message: "Array validation failed",
					code: "invalid_array",
					issues: errors,
				},
			};
		}

		return { success: true, data: result };
	});
}
