import { createSignal as createCoreSignal } from "../../apis/signal";
import { createEffect } from "../../services/effect.scope";
import type { SignalStore, Unsubscriber } from "../../types";

export function signalStore<T>(initialValue: T): SignalStore<T> {
	const [getter, setter] = createCoreSignal(initialValue);
	const subscribers = new Set<(value: T) => void>();
	let currentValue = initialValue;

	const subscribe = (
		run: (value: T) => void,
		_invalidate?: (value?: T) => void,
	): Unsubscriber => {
		subscribers.add(run);

		const cleanup = createEffect(() => {
			currentValue = getter();
			run(currentValue);
		});

		return () => {
			subscribers.delete(run);
			cleanup();
		};
	};

	const set = (value: T): void => {
		setter(value);
	};

	const update = (updater: (value: T) => T): void => {
		setter(updater(getter()));
	};

	return {
		subscribe,
		set,
		update,
	};
}

export function derivedStore<T, U>(
	store: SignalStore<T>,
	fn: (value: T) => U,
): SignalStore<U> {
	let currentValue: U;
	const subscribers = new Set<(value: U) => void>();

	const subscribe = (
		run: (value: U) => void,
		_invalidate?: (value?: U) => void,
	): Unsubscriber => {
		subscribers.add(run);

		const cleanup = store.subscribe((value) => {
			currentValue = fn(value);
			run(currentValue);
		});

		return () => {
			subscribers.delete(run);
			cleanup();
		};
	};

	const set = (value: U): void => {
		currentValue = value;
		subscribers.forEach((sub) => sub(value));
	};

	const update = (updater: (value: U) => U): void => {
		set(updater(currentValue));
	};

	return {
		subscribe,
		set,
		update,
	};
}

export function writable<T>(initialValue: T): SignalStore<T> {
	return signalStore(initialValue);
}

export function readable<T>(
	initialValue: T,
	start?: (set: (value: T) => void) => () => void,
): SignalStore<T> {
	const store = signalStore(initialValue);

	if (start) {
		const stop = start((value) => {
			store.set(value);
		});

		return {
			...store,
			subscribe: (run, invalidate) => {
				const unsubscribe = store.subscribe(run, invalidate);
				return () => {
					unsubscribe();
					stop?.();
				};
			},
		};
	}

	return store;
}
