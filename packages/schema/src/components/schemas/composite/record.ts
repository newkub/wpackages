import type { Result, Schema, ValidationError } from "../../../types/core";
import { createSchema } from "../../core/schema";
import { pushIssues } from "./issue-utils";

// Record schema
export function record<T>(valueSchema: Schema<T>): Schema<Record<string, T>> {
	return createSchema("record", (value): Result<Record<string, T>> => {
		if (typeof value !== "object" || value === null) {
			return {
				success: false,
				error: {
					path: [],
					message: `Expected object, got ${typeof value}`,
					code: "invalid_type",
				},
			};
		}

		const result: Record<string, T> = {};
		const errors: ValidationError[] = [];

		for (const [key, val] of Object.entries(value)) {
			const valResult = valueSchema.safeParse(val);

			if (!valResult.success) {
				pushIssues(errors, {
					prefixPath: [key],
					error: valResult.error,
				});
			} else {
				result[key] = valResult.data;
			}
		}

		if (errors.length > 0) {
			return {
				success: false,
				error: {
					path: [],
					message: "Record validation failed",
					code: "invalid_record",
					issues: errors,
				},
			};
		}

		return { success: true, data: result };
	});
}
