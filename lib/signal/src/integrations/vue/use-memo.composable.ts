import { ref, watchEffect } from "vue";
import type { Accessor } from "../../types";
import { createMemo as createCoreMemo } from "../../apis/memo";

export function useMemo<T>(fn: () => T): Accessor<T> {
	const memoRef = ref<Accessor<T>>();

	if (!memoRef.value) {
		memoRef.value = createCoreMemo(fn);
	}

	const memo = memoRef.value;

	watchEffect(() => {
		memo();
	});

	return memo;
}

export function useComputed<T>(fn: () => T): Accessor<T> {
	const memo = useMemo(fn, []);

	return () => memo();
}

export function useComputedValue<T>(fn: () => T) {
	const memo = useComputed(fn);

	return {
		value: memo,
	};
}
