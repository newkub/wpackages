import { createSchema } from "../lib/create-schema";
import type { Result, Schema } from "./index";

export type MergeOptions<
	TShape1 extends Record<string, Schema<unknown, unknown>>,
	TShape2 extends Record<string, Schema<unknown, unknown>>,
> = {
	schema1: TShape1;
	schema2: TShape2;
	message?: string;
	name?: string;
};

export type MergeOutput<
	TShape1 extends Record<string, Schema<unknown, unknown>>,
	TShape2 extends Record<string, Schema<unknown, unknown>>,
> = {
	[K in keyof TShape1]: TShape1[K] extends Schema<unknown, infer O> ? O : never;
} & {
	[K in keyof TShape2]: TShape2[K] extends Schema<unknown, infer O> ? O : never;
};

export function merge<
	TShape1 extends Record<string, Schema<unknown, unknown>>,
	TShape2 extends Record<string, Schema<unknown, unknown>>,
>(options: MergeOptions<TShape1, TShape2>): Schema<unknown, MergeOutput<TShape1, TShape2>> {
	return createSchema({
		_metadata: { name: options.name || "merge" },
		_input: {} as unknown,
		_output: {} as MergeOutput<TShape1, TShape2>,
		parse(input: unknown): Result<MergeOutput<TShape1, TShape2>> {
			if (typeof input !== "object" || input === null) {
				return {
					success: false,
					issues: [
						{
							message: options.message || "Expected an object",
							path: [],
						},
					],
				};
			}

			const issues: any[] = [];
			const output: Record<string, unknown> = {};
			const record = input as Record<string, unknown>;

			const schemas = { ...options.schema1, ...options.schema2 };

			for (const key in schemas) {
				if (Object.hasOwn(schemas, key)) {
					const schema = schemas[key];
					const value = record[key];
					const result = schema.parse(value);

					if (result.success) {
						output[key] = result.data;
					} else {
						issues.push(
							...result.issues.map((issue: any) => ({
								...issue,
								path: [key, ...issue.path],
							})),
						);
					}
				}
			}

			if (issues.length > 0) {
				return { success: false, issues };
			}

			return {
				success: true,
				data: output as MergeOutput<TShape1, TShape2>,
			};
		},
	});
}
