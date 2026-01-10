import type { Accessor } from "../../types";
import { createMemo as createCoreMemo } from "../../apis/memo";
import { createEffect } from "../../services/effect.scope";

export function useMemo<T>(fn: () => T): Accessor<T> {
	return createCoreMemo(fn);
}

export function useComputed<T>(fn: () => T): Accessor<T> {
	return useMemo(fn, []);
}

export function useComputedStore<T>(fn: () => T) {
	const memo = useMemo(fn, []);

	return {
		subscribe: (callback: (value: T) => void) => {
			return createEffect(() => {
				callback(memo());
			});
		},
	};
}
