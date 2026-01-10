import { computed, ref, watchEffect } from "vue";
import type { Accessor, Setter, Signal } from "../../types";
import { createSignal as createCoreSignal } from "../../apis/signal";

export function useSignal<T>(
	initialValue: T,
	options?: { equals?: false | ((prev: T, next: T) => boolean) },
): Signal<T> {
	const signalRef = ref<Signal<T>>();

	if (!signalRef.value) {
		signalRef.value = createCoreSignal(initialValue, options);
	}

	return signalRef.value;
}

export function useSignalValue<T>(signal: Accessor<T>): Accessor<T> {
	const valueRef = ref<T>(signal());

	watchEffect(() => {
		valueRef.value = signal();
	});

	return () => valueRef.value;
}

export function useSignalSetter<T>(signal: Setter<T>): Setter<T> {
	return signal;
}

export function useSignalRef<T>(
	initialValue: T,
	options?: { equals?: false | ((prev: T, next: T) => boolean) },
) {
	const [getter, setter] = useSignal(initialValue, options);

	const value = computed(() => getter());

	return {
		value,
		setValue: setter,
	};
}
