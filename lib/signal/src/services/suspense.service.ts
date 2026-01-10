import type { SuspenseOptions, SuspenseResult } from "../types";
import { createSignal, createEffect, onCleanup } from "../index";

const suspenseContext = new Map<string, SuspenseResult>();

export function createSuspense<T>(
	fn: () => Promise<T>,
	options?: SuspenseOptions,
): SuspenseResult {
	const id = `suspense-${Date.now()}-${Math.random()}`;

	const [data, setData] = createSignal<T | undefined>(undefined);
	const [loading, setLoading] = createSignal(true);
	const [error, setError] = createSignal<unknown>(undefined);

	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	const execute = async () => {
		setLoading(true);
		setError(undefined);

		if (options?.timeout) {
			timeoutId = setTimeout(() => {
				setError(new Error(`Suspense timeout after ${options.timeout}ms`));
				setLoading(false);
			}, options.timeout);
		}

		try {
			const result = await fn();
			setData(result);
		} catch (err) {
			setError(err);
		} finally {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			setLoading(false);
		}
	};

	createEffect(() => {
		execute();
	});

	const result: SuspenseResult = {
		get data() {
			return data();
		},
		get loading() {
			return loading();
		},
		get error() {
			return error();
		},
	};

	suspenseContext.set(id, result);

	onCleanup(() => {
		suspenseContext.delete(id);
	});

	return result;
}

export function useSuspense<T>(
	fn: () => Promise<T>,
	options?: SuspenseOptions,
): SuspenseResult {
	return createSuspense(fn, options);
}

export function getSuspenseContext(id: string): SuspenseResult | undefined {
	return suspenseContext.get(id);
}

export function clearSuspenseContext(id: string): void {
	suspenseContext.delete(id);
}

export function clearAllSuspenseContexts(): void {
	suspenseContext.clear();
}

export function createSuspenseBoundary<T>(
	fn: () => Promise<T>,
	fallback?: any,
	options?: SuspenseOptions,
): SuspenseResult {
	const result = createSuspense(fn, options);

	if (result.loading && fallback !== undefined) {
		return {
			data: fallback,
			loading: true,
			error: undefined,
		};
	}

	return result;
}

export function createSuspenseList<T>(
	fns: Array<() => Promise<T>>,
	options?: SuspenseOptions,
): SuspenseResult[] {
	return fns.map((fn) => createSuspense(fn, options));
}
