import { createSchema } from "../lib/create-schema";
import type { ConditionalSchema, Result, Schema } from "./index";

export type ConditionalOptions<TInput, TOutput> = {
	condition: ConditionalSchema<TInput, TOutput>;
	message?: string;
	name?: string;
};

export function conditional<TInput, TOutput>(
	options: ConditionalOptions<TInput, TOutput>,
): Schema<TInput, TOutput> {
	return createSchema({
		_metadata: { name: options.name || "conditional" },
		_input: {} as TInput,
		_output: {} as TOutput,
		parse(input: unknown): Result<TOutput> {
			const schema = options.condition(input);
			if (!schema) {
				return {
					success: false,
					issues: [
						{
							message: options.message || "No matching schema for condition",
							path: [],
						},
					],
				};
			}
			return schema.parse(input);
		},
	});
}
