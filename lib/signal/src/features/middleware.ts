import type { Accessor, Setter, Signal } from "../types/ref.type";
import type { SignalOptions } from "../types/ref.type";

export type SignalMiddleware<T> = (
	get: Accessor<T>,
	set: Setter<T>,
	next: (value: T) => T,
) => T;

export interface SignalMiddlewareOptions<T> extends SignalOptions<T> {
	middleware?: SignalMiddleware<T>[];
}

export const createSignalWithMiddleware = <T>(
	initialValue: T,
	options: SignalMiddlewareOptions<T>,
): Signal<T> => {
	const middleware = options.middleware ?? [];

	const applyMiddleware = (
		get: Accessor<T>,
		set: Setter<T>,
		value: T,
	): T => {
		let result = value;
		for (let i = middleware.length - 1; i >= 0; i--) {
			const mw = middleware[i];
			result = mw(get, set, () => result);
		}
		return result;
	};

	const [get, set] = createSignal(initialValue, {
		equals: options.equals,
	});

	const middlewareSet: Setter<T> = (value) => {
		const processedValue = applyMiddleware(get, set, value);
		return set(processedValue);
	};

	return [get, middlewareSet];
};

export const withMiddleware = <T>(
	signal: Signal<T>,
	middleware: SignalMiddleware<T>[],
): Signal<T> => {
	const [get, set] = signal;

	const applyMiddleware = (value: T): T => {
		let result = value;
		for (let i = middleware.length - 1; i >= 0; i--) {
			const mw = middleware[i];
			result = mw(get, set, () => result);
		}
		return result;
	};

	const middlewareSet: Setter<T> = (value) => {
		const processedValue = applyMiddleware(value);
		return set(processedValue);
	};

	return [get, middlewareSet];
};

export const loggingMiddleware = <T>(
	get: Accessor<T>,
	_set: Setter<T>,
	next: (value: T) => T,
): T => {
	const prev = get();
	const result = next(result);
	console.log(`Signal changed:`, { prev, next: result });
	return result;
};

export const debounceMiddleware = <T>(delay: number): SignalMiddleware<T> => {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return (get, set, next) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		const value = next(value);

		return new Promise<T>((resolve) => {
			timeoutId = setTimeout(() => {
				resolve(value);
			}, delay);
		}) as T;
	};
};

export const validationMiddleware = <T>(
	validator: (value: T) => boolean,
	errorMessage: string,
): SignalMiddleware<T> => {
	return (get, set, next) => {
		const value = next(value);
		if (!validator(value)) {
			throw new Error(errorMessage);
		}
		return value;
	};
};
