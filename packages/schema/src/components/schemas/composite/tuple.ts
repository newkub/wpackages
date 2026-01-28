import type { Result, Schema, ValidationError } from "../../../types/core";
import { createSchema } from "../../core/schema";
import { pushIssues } from "./issue-utils";

// Tuple schema
export function tuple<T extends readonly Schema<any>[]>(schemas: T): Schema<
	{ [K in keyof T]: T[K] extends Schema<infer U> ? U : never }
> {
	return createSchema(
		"tuple",
		(value): Result<{ [K in keyof T]: T[K] extends Schema<infer U> ? U : never }> => {
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

			if (value.length !== schemas.length) {
				return {
					success: false,
					error: {
						path: [],
						message: `Expected tuple of length ${schemas.length}, got ${value.length}`,
						code: "invalid_tuple",
					},
				};
			}

			const result: unknown[] = [];
			const errors: ValidationError[] = [];

			for (let i = 0; i < schemas.length; i++) {
				const itemResult = schemas[i]?.safeParse(value[i]);

				if (!itemResult?.success) {
					const index = String(i);
					pushIssues(errors, {
						prefixPath: [index],
						error: itemResult?.error ?? {
							path: [],
							message: "Invalid item",
							code: "invalid_item",
						},
						fallbackMessage: itemResult?.error?.message || "Invalid item",
						fallbackCode: itemResult?.error?.code || "invalid_item",
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
						message: "Tuple validation failed",
						code: "invalid_tuple",
						issues: errors,
					},
				};
			}

			return { success: true, data: result as any };
		},
	);
}
