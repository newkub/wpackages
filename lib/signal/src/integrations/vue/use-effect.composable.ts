import { watch } from "vue";
import type { Accessor } from "../../types";
import { createEffect, onCleanup } from "../../services/effect.scope";
import { watch as coreWatch } from "../../services/watch.service";

export function useEffect(fn: () => void): () => void {
	return createEffect(fn);
}

export { onCleanup as useOnCleanup };

export function useWatch<T>(
	source: Accessor<T>,
	callback: (value: T, prevValue: T | undefined) => void,
	options?: { immediate?: boolean },
): () => void {
	return coreWatch(source, callback, options);
}

export function useWatchEffect(fn: () => void): () => void {
	return createEffect(fn);
}

export function useWatchMultiple<T extends readonly Accessor<any>[]>(
	sources: T,
	callback: (values: any[], prevValues: any[] | undefined) => void,
	options?: { immediate?: boolean },
): () => void {
	return coreWatch(sources as any, callback, options);
}

export function useVueWatch<T>(
	source: Accessor<T>,
	callback: (value: T, prevValue: T | undefined) => void,
	options?: { immediate?: boolean; deep?: boolean },
) {
	watch(
		() => source(),
		(newValue, oldValue) => {
			callback(newValue, oldValue);
		},
		options,
	);
}
