import { useEffect, useRef, useState } from "react";
import type { Accessor, Setter, Signal } from "../../types";
import { createSignal as createCoreSignal } from "../../apis/signal";

export function useSignal<T>(
	initialValue: T,
	options?: { equals?: false | ((prev: T, next: T) => boolean) },
): Signal<T> {
	const signalRef = useRef<Signal<T>>();

	if (!signalRef.current) {
		signalRef.current = createCoreSignal(initialValue, options);
	}

	const [getter] = signalRef.current;
	const [, _forceUpdate] = useState({});

	useEffect(() => {
		const effect = () => {
			getter();
			_forceUpdate({});
		};

		effect();

		return () => {};
	}, [getter]);

	return signalRef.current;
}

export function useSignalValue<T>(signal: Accessor<T>): T {
	const [, _forceUpdate] = useState({});
	const valueRef = useRef<T>(signal());

	useEffect(() => {
		valueRef.current = signal();
		_forceUpdate({});
	}, [signal]);

	return valueRef.current;
}

export function useSignalSetter<T>(signal: Setter<T>): Setter<T> {
	return signal;
}
