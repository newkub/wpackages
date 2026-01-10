import type { LazySchema, Schema } from "../types";

export function lazy<T>(getter: LazySchema<T>): Schema<T, T> {
	let cachedSchema: Schema<T, T> | null = null;

	return {
		_metadata: { name: "lazy" },
		_input: {} as T,
		_output: {} as T,
		parse: (input: unknown) => {
			if (!cachedSchema) {
				cachedSchema = getter();
			}
			return cachedSchema.parse(input);
		},
		parseAsyncInternal: async (input: unknown, context?) => {
			if (!cachedSchema) {
				cachedSchema = getter();
			}
			if (cachedSchema.parseAsyncInternal) {
				return cachedSchema.parseAsyncInternal(input, context) as Promise<any>;
			}
			const result = cachedSchema.parse(input, context);
			return Promise.resolve(result);
		},
		parseAsync: async (input: unknown, context?) => {
			if (!cachedSchema) {
				cachedSchema = getter();
			}
			const result = cachedSchema.parseAsyncInternal
				? await cachedSchema.parseAsyncInternal(input, context)
				: cachedSchema.parse(input, context);
			return result as any;
		},
		optional: () => lazy(() => getter().optional()),
		transform: <TNew>(fn: (value: T) => TNew) => lazy(() => getter().transform(fn)) as any,
		refine: (ref) => lazy(() => getter().refine(ref)),
		default: (val) => lazy(() => getter().default(val)),
		description: (desc) => {
			const newLazy = lazy(() => getter().description(desc));
			const schema = getter().description(desc);
			(newLazy as any)._metadata = schema._metadata;
			return newLazy;
		},
		examples: (...ex) => {
			const newLazy = lazy(() => getter().examples(...ex));
			const schema = getter().examples(...ex);
			(newLazy as any)._metadata = schema._metadata;
			return newLazy;
		},
		metadata: (data) => {
			const newLazy = lazy(() => getter().metadata(data));
			const schema = getter().metadata(data);
			(newLazy as any)._metadata = schema._metadata;
			return newLazy;
		},
	};
}
