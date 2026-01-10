import type {
	Issue,
	Refinement,
	Result,
	Schema,
	SchemaMetadata,
} from "../types";

type SchemaDefinition<TInput, TOutput> = Omit<
	Schema<TInput, TOutput>,
	"transform" | "optional" | "refine" | "default" | "description" | "examples" | "metadata" | "parseAsync"
>;

export function createSchema<TInput, TOutput>(
	definition: SchemaDefinition<TInput, TOutput>,
): Schema<TInput, TOutput> {
	const refineIssue = (value: TOutput, refinement: Refinement<TOutput>): Issue[] => {
		const result = refinement(value);
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
		...definition,
		optional: (): Schema<TInput | undefined, TOutput | undefined> => {
			return createSchema({
				...definition,
				_metadata: definition._metadata,
				_input: undefined as TInput | undefined,
				_output: undefined as TOutput | undefined,
				parse: (
					input: unknown,
					context?: Parameters<Schema<TInput, TOutput>["parse"]>[1],
				): Result<TOutput | undefined> => {
					if (input === undefined) {
						return { success: true, data: undefined };
					}
					return definition.parse(input, context) as Result<TOutput>;
				},
			});
		},
		transform: <TNewOutput>(
			transformer: (value: TOutput) => TNewOutput,
		): Schema<TInput, TNewOutput> => {
			const newDefinition: any = {
				...definition,
				_metadata: definition._metadata,
				_output: {} as TNewOutput,
				parse: (input: unknown): Result<TNewOutput> => {
					const result = definition.parse(input);
					if (result.success) {
						try {
							return { success: true, data: transformer(result.data) };
						} catch (e: unknown) {
							const message = e instanceof Error ? e.message : String(e);
							return {
								success: false,
								issues: [{ message, path: [] }],
							};
						}
					}
					return result;
				},
			};

			if (definition.parseAsyncInternal) {
				newDefinition.parseAsyncInternal = async (
					input: unknown,
					context?: Partial<ValidationContext>,
				) => {
					const result = await definition.parseAsyncInternal(input, context);
					if (result.success) {
						try {
							return { success: true, data: transformer(result.data) };
						} catch (e: unknown) {
							const message = e instanceof Error ? e.message : String(e);
							return {
								success: false,
								issues: [{ message, path: [] }],
							};
						}
					}
					return result;
				};
			}

			return createSchema(newDefinition);
		},
		refine: (refinement: Refinement<TOutput>): Schema<TInput, TOutput> => {
			return createSchema({
				...definition,
				_metadata: definition._metadata,
				parse: (input: unknown): Result<TOutput> => {
					const result = definition.parse(input);
					if (!result.success) return result;
					const issues = refineIssue(result.data, refinement);
					if (issues.length > 0) {
						return { success: false, issues };
					}
					return result;
				},
			});
		},
		default: (defaultValue: TOutput): Schema<TInput, TOutput> => {
			return createSchema({
				...definition,
				_metadata: { ...definition._metadata, default: defaultValue },
				parse: (input: unknown): Result<TOutput> => {
					if (input === undefined || input === null) {
						return { success: true, data: defaultValue };
					}
					return definition.parse(input);
				},
			});
		},
		description: (desc: string): Schema<TInput, TOutput> => {
			return createSchema({
				...definition,
				_metadata: { ...definition._metadata, description: desc },
			});
		},
		examples: (...examples: unknown[]): Schema<TInput, TOutput> => {
			return createSchema({
				...definition,
				_metadata: { ...definition._metadata, examples },
			});
		},
		metadata: (data: Partial<SchemaMetadata>): Schema<TInput, TOutput> => {
			return createSchema({
				...definition,
				_metadata: { ...definition._metadata, ...data },
			});
		},
	};
}
