import { createSchema } from "../lib/create-schema";
import type { Result, Schema } from "./index";

export type PartialOptions<
	TShape extends Record<string, Schema<unknown, unknown>>,
> = {
	shape: TShape;
	message?: string;
	name?: string;
};

export type PartialOutput<TShape extends Record<string, Schema<unknown, unknown>>> = {
	[K in keyof TShape]?: TShape[K] extends Schema<unknown, infer O> ? O : never;
};

export function partial<
	TShape extends Record<string, Schema<unknown, unknown>>,
>(options: PartialOptions<TShape>): Schema<unknown, PartialOutput<TShape>> {
	return createSchema({
		_metadata: { name: options.name || "partial" },
		_input: {} as unknown,
		_output: {} as PartialOutput<TShape>,
		parse(input: unknown): Result<PartialOutput<TShape>> {
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

			for (const key in options.shape) {
				if (Object.hasOwn(options.shape, key)) {
					if (Object.hasOwn(record, key)) {
						const schema = options.shape[key];
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
			}

			if (issues.length > 0) {
				return { success: false, issues };
			}

			return { success: true, data: output as PartialOutput<TShape> };
		},
	});
}

export type RequiredOptions<
	TShape extends Record<string, Schema<unknown, unknown>>,
> = {
	shape: TShape;
	message?: string;
	name?: string;
};

export type RequiredOutput<TShape extends Record<string, Schema<unknown, unknown>>> = {
	[K in keyof TShape]-?: TShape[K] extends Schema<unknown, infer O> ? O : never;
};

export function required<
	TShape extends Record<string, Schema<unknown, unknown>>,
>(options: RequiredOptions<TShape>): Schema<unknown, RequiredOutput<TShape>> {
	return createSchema({
		_metadata: { name: options.name || "required" },
		_input: {} as unknown,
		_output: {} as RequiredOutput<TShape>,
		parse(input: unknown): Result<RequiredOutput<TShape>> {
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

			for (const key in options.shape) {
				if (Object.hasOwn(options.shape, key)) {
					const schema = options.shape[key];
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

			return { success: true, data: output as RequiredOutput<TShape> };
		},
	});
}
