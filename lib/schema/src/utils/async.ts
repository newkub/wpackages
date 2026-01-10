import type { AsyncResult, Issue, Result, Schema } from "../types";

export type AsyncRefinement<T> = (
	value: T,
) => boolean | string | Issue | Issue[] | Promise<boolean | string | Issue | Issue[]>;

export function withAsync<TInput, TOutput>(
	schema: Schema<TInput, TOutput>,
): Schema<TInput, TOutput> {
	return {
		...schema,
		parseAsync: async (input: unknown, context?) => {
			if (schema.parseAsyncInternal) {
				return schema.parseAsyncInternal(input, context);
			}
			return schema.parse(input, context);
		},
	};
}

export function asyncRefine<TInput, TOutput>(
	schema: Schema<TInput, TOutput>,
	refinement: AsyncRefinement<TOutput>,
): Schema<TInput, TOutput> {
	const refineIssue = async (value: TOutput): Promise<Issue[]> => {
		const result = await refinement(value);
		if (result === true) return [];
		if (result === false) {
			return [{ message: "Refinement failed", path: [] }];
		}
		if (typeof result === "string") {
			return [{ message: result, path: [] }];
		}
		if (Array.isArray(result)) {
			return result;
		}
		return [result];
	};

	return {
		...schema,
		parse: (input: unknown): Result<TOutput> => {
			const result = schema.parse(input);
			if (!result.success) return result;
			return result;
		},
		parseAsyncInternal: async (input: unknown, context?): AsyncResult<TOutput> => {
			const result = schema.parse(input, context);
			if (!result.success) return result;
			const issues = await refineIssue(result.data);
			if (issues.length > 0) {
				return { success: false, issues };
			}
			return result;
		},
		parseAsync: async (input: unknown, context?) => {
			const result = schema.parse(input, context);
			if (!result.success) return result;
			const issues = await refineIssue(result.data);
			if (issues.length > 0) {
				return { success: false, issues };
			}
			return result;
		},
	};
}
