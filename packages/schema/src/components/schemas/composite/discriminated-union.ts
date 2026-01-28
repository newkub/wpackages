import type { Result, Schema, ValidationError } from "../../../types/core";
import { createSchema } from "../../core/schema";

export function discriminatedUnion<
	K extends string,
	T extends readonly [Schema<any>, ...Schema<any>[]],
>(discriminator: K, schemas: T): Schema<T[number] extends Schema<infer U> ? U : never> {
	type Out = T[number] extends Schema<infer U> ? U : never;
	return createSchema("discriminated_union", (value): Result<Out> => {
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
		if (!(discriminator in input)) {
			return {
				success: false,
				error: {
					path: [discriminator],
					message: `Missing discriminator ${discriminator}`,
					code: "invalid_discriminator",
				},
			};
		}

		const discValue = input[discriminator];
		const errors: ValidationError[] = [];

		for (const schema of schemas) {
			const result = schema.safeParse(value);
			if (result.success) {
				return result as Result<Out>;
			}
			errors.push({
				path: [discriminator],
				message: result.error.message,
				code: result.error.code,
			});
		}

		return {
			success: false,
			error: {
				path: [discriminator],
				message: `Discriminated union validation failed for ${JSON.stringify(discValue)}`,
				code: "invalid_union",
				issues: errors,
			},
		};
	});
}

export function discriminatedUnionMap<
	K extends string,
	M extends Record<string, Schema<any>>,
>(discriminator: K, mapping: M): Schema<M[keyof M] extends Schema<infer U> ? U : never> {
	type Out = M[keyof M] extends Schema<infer U> ? U : never;
	const keys = Object.keys(mapping);

	return createSchema("discriminated_union", (value): Result<Out> => {
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
		const discValue = input[discriminator];
		if (typeof discValue !== "string") {
			return {
				success: false,
				error: {
					path: [discriminator],
					message: `Invalid discriminator ${discriminator}`,
					code: "invalid_discriminator",
				},
			};
		}

		const schema = mapping[discValue];
		if (!schema) {
			return {
				success: false,
				error: {
					path: [discriminator],
					message: `Unknown discriminator ${JSON.stringify(discValue)}. Expected one of ${keys.join(", ")}`,
					code: "invalid_discriminator",
				},
			};
		}

		return schema.safeParse(value) as Result<Out>;
	});
}
