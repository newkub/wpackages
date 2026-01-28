import type { ObjectSchema, Result, Schema, ValidationError } from "../../../types/core";
import { createSchema } from "../../core/schema";
import { pushIssues } from "./issue-utils";

// Object schema
export function object<T extends Record<string, Schema<any>>>(
	shape: T,
): ObjectSchema<{ [K in keyof T]: T[K] extends Schema<infer U> ? U : never }> {
	type Out = { [K in keyof T]: T[K] extends Schema<infer U> ? U : never };
	type Mode = "strip" | "passthrough" | "strict";

	const entries = Object.entries(shape) as Array<[string, Schema<any>]>;
	const shapeKeys = new Set(Object.keys(shape));

	const createObjectSchema = (mode: Mode): ObjectSchema<Out> => {
		const schema = createSchema("object", (value): Result<Out> => {
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

			const input = value as Record<string, unknown>;
			const result: Record<string, unknown> = mode === "passthrough" ? { ...input } : {};
			const errors: ValidationError[] = [];

			if (mode === "strict") {
				for (const key of Object.keys(input)) {
					if (!shapeKeys.has(key)) {
						errors.push({
							path: [key],
							message: `Unrecognized key: ${key}`,
							code: "unrecognized_key",
						});
					}
				}
			}

			for (const [key, fieldSchema] of entries) {
				const fieldResult = fieldSchema.safeParse(input[key]);
				if (!fieldResult.success) {
					pushIssues(errors, {
						prefixPath: [key],
						error: fieldResult.error,
					});
				} else {
					result[key] = fieldResult.data;
				}
			}

			if (errors.length > 0) {
				return {
					success: false,
					error: {
						path: [],
						message: "Object validation failed",
						code: "invalid_object",
						issues: errors,
					},
				};
			}

			return { success: true, data: result as Out };
		});

		const withMethods = schema as ObjectSchema<Out>;
		(withMethods as any).strict = () => createObjectSchema("strict");
		(withMethods as any).passthrough = () => createObjectSchema("passthrough");
		(withMethods as any).strip = () => createObjectSchema("strip");
		return withMethods;
	};

	return createObjectSchema("strip");
}
