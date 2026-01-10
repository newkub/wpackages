import type { Schema } from "@wpackages/schema";
import { validate } from "@wpackages/schema";
import type { Accessor, Setter, Signal } from "../types/ref.type";
import type { SignalOptions } from "../types/ref.type";

export interface SignalSchemaOptions<T> extends SignalOptions<T> {
	schema: Schema<T>;
}

export const createSignalWithSchema = <T>(
	initialValue: T,
	options: SignalSchemaOptions<T>,
): Signal<T> => {
	const [get, set] = createSignal(initialValue, {
		equals: options.equals,
	});

	const validatedSet: Setter<T> = (value) => {
		const result = validate(options.schema, value);
		if (result.success) {
			return set(result.data);
		}
		throw new Error(`Signal validation failed: ${result.errors.join(", ")}`);
	};

	return [get, validatedSet];
};

export const withSchema = <T>(
	signal: Signal<T>,
	schema: Schema<T>,
): Signal<T> => {
	const [get, set] = signal;

	const validatedSet: Setter<T> = (value) => {
		const result = validate(schema, value);
		if (result.success) {
			return set(result.data);
		}
		throw new Error(`Signal validation failed: ${result.errors.join(", ")}`);
	};

	return [get, validatedSet];
};
