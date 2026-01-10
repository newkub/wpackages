import type { Accessor } from "../types/ref.type";

export interface SignalObserver<T> {
	onChange?: (value: T, prev: T) => void;
	onRead?: () => void;
	onUpdateFrequency?: (frequency: number) => void;
}

export interface SignalObservation<T> {
	readonly signal: Accessor<T>;
	readonly readCount: number;
	readonly updateCount: number;
	readonly lastReadAt: number;
	readonly lastUpdateAt: number;
	dispose: () => void;
}

const observations = new WeakMap<Accessor<unknown>, {
	reads: number;
	updates: number;
	lastReadAt: number;
	lastUpdateAt: number;
	listeners: Set<SignalObserver<unknown>>;
}>();

export const observeSignal = <T>(
	signal: Accessor<T>,
	observer: SignalObserver<T>,
): SignalObservation<T> => {
	let data = observations.get(signal);

	if (!data) {
		data = {
			reads: 0,
			updates: 0,
			lastReadAt: 0,
			lastUpdateAt: 0,
			listeners: new Set(),
		};
		observations.set(signal, data);
	}

	data.listeners.add(observer as unknown as SignalObserver<unknown>);

	const originalGetter = signal;
	let currentValue: T;

	const observedGetter = (): T => {
		data.reads++;
		data.lastReadAt = Date.now();
		currentValue = originalGetter();
		observer.onRead?.();
		observer.onUpdateFrequency?.(data.updates / (data.reads || 1));
		return currentValue;
	};

	const dispose = () => {
		data.listeners.delete(observer as unknown as SignalObserver<unknown>);
		if (data.listeners.size === 0) {
			observations.delete(signal);
		}
	};

	return {
		signal: observedGetter,
		get readCount() {
			return data.reads;
		},
		get updateCount() {
			return data.updates;
		},
		get lastReadAt() {
			return data.lastReadAt;
		},
		get lastUpdateAt() {
			return data.lastUpdateAt;
		},
		dispose,
	};
};

export const getSignalStats = <T>(signal: Accessor<T>): {
	reads: number;
	updates: number;
	lastReadAt: number;
	lastUpdateAt: number;
} | null => {
	const data = observations.get(signal);
	if (!data) return null;

	return {
		reads: data.reads,
		updates: data.updates,
		lastReadAt: data.lastReadAt,
		lastUpdateAt: data.lastUpdateAt,
	};
};
