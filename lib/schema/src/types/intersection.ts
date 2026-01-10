import { createSchema } from "../lib/create-schema";
import type { Result, Schema } from "./index";

type IntersectionOptions<
	T extends readonly [Schema<unknown, unknown>, ...Schema<unknown, unknown>[]],
> = {
	options: T;
	message?: string;
};

type IntersectionOutput<
	T extends readonly [Schema<unknown, unknown>, ...Schema<unknown, unknown>[]],
> = T[number] extends Schema<unknown, infer O> ? O : never;

export function intersection<
	T extends readonly [Schema<unknown, unknown>, ...Schema<unknown, unknown>[]],
>(options: IntersectionOptions<T>): Schema<unknown, IntersectionOutput<T>>;

export function intersection<
	T extends readonly [Schema<unknown, unknown>, ...Schema<unknown, unknown>[]],
>(options: T, message?: string): Schema<unknown, IntersectionOutput<T>>;

export function intersection<
	T extends readonly [Schema<unknown, unknown>, ...Schema<unknown, unknown>[]],
>(
	options: IntersectionOptions<T> | T,
	message?: string,
): Schema<unknown, IntersectionOutput<T>> {
	let normalized: IntersectionOptions<T>;

	if (Array.isArray(options)) {
		normalized = message !== undefined
			? { options: options as T, message }
			: { options: options as T };
	} else {
		normalized = options as IntersectionOptions<T>;
	}

	return createSchema({
		_metadata: { name: "intersection" },
		_input: {} as unknown,
		_output: {} as IntersectionOutput<T>,
		parse(input: unknown): Result<IntersectionOutput<T>> {
			if (typeof input !== "object" || input === null) {
				return {
					success: false,
					issues: [
						{
							message:
								normalized.message ||
									"Expected an object for intersection",
							path: [],
						},
					],
				};
			}

			const issues: any[] = [];
			const output: Record<string, unknown> = {};

			for (const schema of normalized.options) {
				const result = schema.parse(input);
				if (!result.success) {
					issues.push(...result.issues);
				} else {
					Object.assign(output, result.data);
				}
			}

			if (issues.length > 0) {
				return { success: false, issues };
			}

			return {
				success: true,
				data: output as IntersectionOutput<T>,
			};
		},
	});
}
