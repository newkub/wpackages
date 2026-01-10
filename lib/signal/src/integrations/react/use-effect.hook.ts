import { useEffect as useReactEffect, useRef } from "react";
import { createEffect, onCleanup } from "../../services/effect.scope";

export function useEffect(fn: () => void, deps?: any[]): void {
	const effectRef = useRef<(() => void) | undefined>();

	useReactEffect(() => {
		const cleanup = createEffect(fn);
		effectRef.current = cleanup;

		return () => {
			cleanup();
		};
	}, deps);
}

export { onCleanup as useOnCleanup };

export function useWatch<T>(
	source: () => T,
	callback: (value: T, prevValue: T | undefined) => void,
	options?: { immediate?: boolean },
): void {
	useEffect(() => {
		let prevValue: T | undefined;
		let initialized = false;

		const effect = createEffect(() => {
			const value = source();

			if (options?.immediate || initialized) {
				callback(value, prevValue);
			}

			prevValue = value;
			initialized = true;
		});

		return effect;
	}, [source, callback, options]);
}
