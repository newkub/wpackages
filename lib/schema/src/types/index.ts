export type ValidationContext = { path: (string | number)[] };
export type Issue = {
	code?: string;
	message: string;
	path: (string | number)[];
	expected?: string;
	received?: unknown;
	minimum?: number;
	maximum?: number;
	validation?: string;
	pattern?: RegExp;
};

export type Result<T> =
	| { success: true; data: T }
	| { success: false; issues: Issue[] };

export type AsyncResult<T> = Promise<Result<T>>;

export type Refinement<T> = (value: T) => boolean | string | Issue | Issue[];

export type SchemaMetadata = {
	name?: string;
	description?: string;
	examples?: unknown[];
	default?: unknown;
	[custom: string]: unknown;
};

export type SchemaDefinition<TInput, TOutput> = {
	shape?: Record<string, Schema<unknown, unknown>>;
	parse: (
		input: unknown,
		context?: Partial<ValidationContext>,
	) => Result<TOutput>;
	parseAsyncInternal?: (
		input: unknown,
		context?: Partial<ValidationContext>,
	) => AsyncResult<TOutput> | undefined;
	_metadata: SchemaMetadata;
	_input: TInput;
	_output: TOutput;
};

export type Schema<TInput, TOutput = TInput> = SchemaDefinition<TInput, TOutput> & {
	optional: () => Schema<TInput | undefined, TOutput | undefined>;
	transform: <TNewOutput>(
		transformer: (value: TOutput) => TNewOutput,
	) => Schema<TInput, TNewOutput>;
	refine: (refinement: Refinement<TOutput>) => Schema<TInput, TOutput>;
	default: (value: TOutput) => Schema<TInput, TOutput>;
	description: (desc: string) => Schema<TInput, TOutput>;
	examples: (...examples: unknown[]) => Schema<TInput, TOutput>;
	metadata: (data: Partial<SchemaMetadata>) => Schema<TInput, TOutput>;
	parseAsync?: (
		input: unknown,
		context?: Partial<ValidationContext>,
	) => AsyncResult<TOutput>;
};

export type LazySchema<T> = () => Schema<T, T>;

export type ConditionalSchema<TInput, TOutput> = (
	input: unknown,
) => Schema<TInput, TOutput> | null;

export type SchemaTransform<_TInput, TOutput, TNewOutput> = (
	value: TOutput,
) => TNewOutput | Promise<TNewOutput>;

export type Infer<S extends Schema<unknown, unknown>> = S extends Schema<unknown, infer O> ? O : never;
export enum ErrorCode {
	InvalidType = 0,
	InvalidLiteral = 1,
	InvalidEnumValue = 2,
	InvalidString = 3,
	InvalidNumber = 4,
	InvalidDate = 5,
	InvalidObject = 6,
	InvalidArray = 7,
	CustomError = 8,
}
export type StringOptions = {
	min?: number;
	max?: number;
	pattern?: RegExp;
	message?: string;
	name?: string;
};
export type NumberOptions = {
	min?: number;
	max?: number;
	integer?: boolean;
	message?: string;
	name?: string;
};

export type UnknownKeysPolicy = "strip" | "passthrough" | "strict";

export type ObjectOptions<
	TShape extends Record<string, Schema<unknown, unknown>>,
> = {
	shape: TShape;
	message?: string;
	unknownKeys?: UnknownKeysPolicy;
	name?: string;
};

export type ArrayOptions<TItem extends Schema<unknown, unknown>> = {
	item: TItem;
	message?: string;
	name?: string;
};
export type SchemaOptions = {
	message?: string;
	name?: string;
	description?: string;
};
