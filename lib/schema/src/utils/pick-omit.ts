import { createSchema } from "../lib/create-schema";
import type { Result, Schema } from "./index";

export type PickOptions<
	TShape extends Record<string, Schema<unknown, unknown>>,
	TKeys extends keyof TShape,
> = {
	shape: TShape;
	keys: TKeys[];
	message?: string;
	name?: string;
};

export type PickOutput<
	TShape extends Record<string, Schema<unknown, unknown>>,
	TKeys extends keyof TShape,
> = {
	[K in TKeys]: TShape[K] extends Schema<unknown, infer O> ? O : never;
};

export function pick<
	TShape extends Record<string, Schema<unknown, unknown>>,
	TKeys extends keyof TShape,
>(options: PickOptions<TShape, TKeys>): Schema<unknown, PickOutput<TShape, TKeys>> {
	return createSchema({
		_metadata: { name: options.name || "pick" },
		_input: {} as unknown,
		_output: {} as PickOutput<TShape, TKeys>,
		parse(input: unknown): Result<PickOutput<TShape, TKeys>> {
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

			for (const key of options.keys) {
				if (Object.hasOwn(options.shape, key)) {
					const schema = options.shape[key];
					const value = record[key];
					const result = schema.parse(value);

					if (result.success) {
						output[key as string] = result.data;
					} else {
						issues.push(
							...result.issues.map((issue: any) => ({
								...issue,
								path: [key as string, ...issue.path],
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
				data: output as PickOutput<TShape, TKeys>,
			};
		},
	});
}

export type OmitOptions<
	TShape extends Record<string, Schema<unknown, unknown>>,
	TKeys extends keyof TShape,
> = {
	shape: TShape;
	keys: TKeys[];
	message?: string;
	name?: string;
};

export type OmitOutput<
	TShape extends Record<string, Schema<unknown, unknown>>,
	TKeys extends keyof TShape,
> = Omit<
	{
		[K in keyof TShape]: TShape[K] extends Schema<unknown, infer O> ? O : never;
	},
	TKeys
>;

export function omit<
	TShape extends Record<string, Schema<unknown, unknown>>,
	TKeys extends keyof TShape,
>(options: OmitOptions<TShape, TKeys>): Schema<unknown, OmitOutput<TShape, TKeys>> {
	return createSchema({
		_metadata: { name: options.name || "omit" },
		_input: {} as unknown,
		_output: {} as OmitOutput<TShape, TKeys>,
		parse(input: unknown): Result<OmitOutput<TShape, TKeys>> {
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
			const keysToOmit = new Set(options.keys as string[]);

			for (const key in options.shape) {
				if (Object.hasOwn(options.shape, key) && !keysToOmit.has(key)) {
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

			return {
				success: true,
				data: output as OmitOutput<TShape, TKeys>,
			};
		},
	});
}
