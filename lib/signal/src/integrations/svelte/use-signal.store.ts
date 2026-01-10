import type { Accessor, Setter, Signal } from "../../types";
import { createSignal as createCoreSignal } from "../../apis/signal";
import { createEffect } from "../../services/effect.scope";

export function useSignal<T>(
	initialValue: T,
	options?: { equals?: false | ((prev: T, next: T) => boolean) },
): Signal<T> {
	return createCoreSignal(initialValue, options);
}

export function useSignalValue<T>(signal: Accessor<T>): Accessor<T> {
	return signal;
}

export function useSignalSetter<T>(signal: Setter<T>): Setter<T> {
	return signal;
}

export function useSignalStore<T>(initialValue: T) {
	const [getter, setter] = useSignal(initialValue);

	return {
		subscribe: (callback: (value: T) => void) => {
			return createEffect(() => {
				callback(getter());
			});
		},
		set: setter,
	};
}
