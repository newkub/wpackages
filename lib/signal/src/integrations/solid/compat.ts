import type { Accessor, Signal } from "../../types";
import { createSignal as createCoreSignal } from "../../apis/signal";
import { createMemo as createCoreMemo } from "../../apis/memo";
import {
	createEffect as createCoreEffect,
	createEffectScope,
	onCleanup,
} from "../../services/effect.scope";
import { createResource as createCoreResource } from "../../services/resource.service";
import { batch as coreBatch } from "../../services/batch.service";

export function createSignal<T>(
	initialValue: T,
	options?: { equals?: false | ((prev: T, next: T) => boolean) },
): Signal<T> {
	return createCoreSignal(initialValue, options);
}

export function createMemo<T>(
	fn: () => T,
	options?: { equals?: false | ((prev: T, next: T) => boolean) },
): Accessor<T> {
	return createCoreMemo(fn, options);
}

export function createEffect(fn: () => void): () => void {
	return createCoreEffect(fn);
}

export function createRoot(fn: (dispose: () => void) => void): () => void {
	const scope = createEffectScope();
	const dispose = scope.dispose;

	scope.run(() => {
		fn(dispose);
	});

	return dispose;
}

export function createResource<T>(
	source: () => Promise<T> | T,
	initialValue?: T,
): [Accessor<T | undefined>, { loading: Accessor<boolean>; error: Accessor<unknown>; refetch: () => Promise<T | undefined> }] {
	return createCoreResource(source, initialValue);
}

export function createSelector<T>(source: Accessor<T>): (key: T) => boolean {
	return (key: T) => {
		const memo = createMemo(() => source() === key);
		return memo();
	};
}

export function on<T, U>(
	deps: Accessor<T> | Accessor<T>[],
	fn: (value: T | T[], prevValue: T | T[] | undefined) => U,
): () => U | undefined {
	let prevValue: T | T[] | undefined;
	let inited = false;

	return () => {
		const value = Array.isArray(deps) ? deps.map((d) => d()) : deps();

		if (inited && value === prevValue) {
			return undefined;
		}

		const result = untrack(() => fn(value, prevValue));

		prevValue = value;
		inited = true;
		return result;
	};
}

export function untrack<T>(fn: () => T): T {
	const prevEffect = (globalThis as any).__currentEffect;
	(globalThis as any).__currentEffect = null;
	try {
		return fn();
	} finally {
		(globalThis as any).__currentEffect = prevEffect;
	}
}

export function batch<T>(fn: () => T): T {
	return coreBatch(fn);
}

export { onCleanup };

export function mergeProps<T extends Record<string, any>>(...sources: T[]): T {
	const result = {} as T;

	for (const source of sources) {
		for (const key in source) {
			if (Object.prototype.hasOwnProperty.call(source, key)) {
				(result as any)[key] = source[key];
			}
		}
	}

	return result;
}

export function splitProps<T extends Record<string, any>, K extends keyof T>(
	props: T,
	keys: K[],
): [Pick<T, K>, Omit<T, K>] {
	const picked = {} as Pick<T, K>;
	const omitted = {} as Omit<T, K>;

	for (const key in props) {
		if (Object.prototype.hasOwnProperty.call(props, key)) {
			if (keys.includes(key)) {
				(picked as any)[key] = props[key];
			} else {
				(omitted as any)[key] = props[key];
			}
		}
	}

	return [picked, omitted];
}

export function enableScheduling(): void {
}

export function enableHydration(): void {
}

export function createDeferred<T>(source: Accessor<T>, _options?: { timeoutMs?: number }): Accessor<T> {
	return source;
}

export function createComputed<T>(fn: () => T): Accessor<T> {
	return createMemo(fn);
}

export function createReaction<T>(
	fn: () => T,
	_options?: { name?: string },
): Accessor<T> {
	return createMemo(fn);
}
