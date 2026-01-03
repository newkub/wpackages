import { createSchema } from "../lib/create-schema";
import type { Issue, Result, Schema, StringOptions } from "./index";

export type StringSchema = Schema<string> & {
	readonly min: (value: number) => StringSchema;
	readonly max: (value: number) => StringSchema;
	readonly pattern: (value: RegExp) => StringSchema;
	readonly literal: <T extends string>(value: T) => Schema<unknown, T>;
	readonly message: (msg: string) => StringSchema;
	readonly name: (name: string) => StringSchema;
};

export function string(options: StringOptions = {}): StringSchema {
	const create = (next: StringOptions): StringSchema => {
		const base = createSchema({
			_metadata: { name: next.name || "string" },
			_input: "" as string,
			_output: "" as string,
			parse(input: unknown): Result<string> {
				if (typeof input !== "string") {
					return {
						success: false,
						issues: [
							{
								message: next.message
									|| `Expected a string, but received ${typeof input}`,
								path: [],
							},
						],
					};
				}

				const issues: Issue[] = [];

				if (next.min !== undefined && input.length < next.min) {
					issues.push({
						message: `String must contain at least ${next.min} character(s)`,
						path: [],
					});
				}

				if (next.max !== undefined && input.length > next.max) {
					issues.push({
						message: `String must contain at most ${next.max} character(s)`,
						path: [],
					});
				}

				if (next.pattern && !next.pattern.test(input)) {
					issues.push({
						message: `String must match pattern ${next.pattern}`,
						path: [],
					});
				}

				if (issues.length > 0) {
					return { success: false, issues };
				}

				return { success: true, data: input };
			},
		});

		const schema: StringSchema = {
			...base,
			min: (value) => create({ ...next, min: value }),
			max: (value) => create({ ...next, max: value }),
			pattern: (value) => create({ ...next, pattern: value }),
			literal: <T extends string>(value: T): Schema<unknown, T> => {
				return createSchema({
					_metadata: { name: next.name || "string" },
					_input: undefined as unknown,
					_output: value as T,
					parse(input: unknown): Result<T> {
						const baseResult = base.parse(input);
						if (!baseResult.success) {
							return baseResult as unknown as Result<T>;
						}
						if (baseResult.data !== value) {
							return {
								success: false,
								issues: [
									{
										message: `Expected literal ${value}, but received ${baseResult.data}`,
										path: [],
									},
								],
							};
						}
						return { success: true, data: value };
					},
				});
			},
			message: (msg) => create({ ...next, message: msg }),
			name: (name) => create({ ...next, name }),
		};

		return schema;
	};

	return create(options);
}
