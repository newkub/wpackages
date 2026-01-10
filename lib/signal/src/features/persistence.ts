import type { Setter, Signal } from "../types/ref.type";
import type { SignalOptions } from "../types/ref.type";
import { createSignal } from "../apis/signal";

export interface SignalPersistenceOptions<T> extends SignalOptions<T> {
	key: string;
	storage?: Storage;
	version?: number;
	migrations?: Record<number, (state: T) => T>;
}

export const createSignalWithPersistence = <T>(
	initialValue: T,
	options: SignalPersistenceOptions<T>,
): Signal<T> => {
	const storage = options.storage ?? localStorage;
	const key = options.key;
	const version = options.version ?? 1;

	const loadState = (): T => {
		try {
			const stored = storage.getItem(key);
			if (!stored) return initialValue;

			const data = JSON.parse(stored) as { v: number; s: T };
			const savedVersion = data.v;

			if (savedVersion < version && options.migrations) {
				let state = data.s;
				for (let v = savedVersion; v < version; v++) {
					const migration = options.migrations[v];
					if (migration) {
						state = migration(state);
					}
				}
				return state;
			}

			return data.s;
		} catch {
			return initialValue;
		}
	};

	const saveState = (value: T): void => {
		try {
			const data = JSON.stringify({ v: version, s: value });
			storage.setItem(key, data);
		} catch (error) {
			console.error("Failed to persist signal:", error);
		}
	};

	const [get, set] = createSignal(loadState(), {
		equals: options.equals,
	});

	const persistedSet: Setter<T> = (value) => {
		const result = set(value);
		saveState(get());
		return result;
	};

	return [get, persistedSet];
};

export const withPersistence = <T>(
	signal: Signal<T>,
	options: Omit<SignalPersistenceOptions<T>, "equals">,
): Signal<T> => {
	const storage = options.storage ?? localStorage;
	const key = options.key;
	const version = options.version ?? 1;

	const [get, set] = signal;

	const saveState = (value: T): void => {
		try {
			const data = JSON.stringify({ v: version, s: value });
			storage.setItem(key, data);
		} catch (error) {
			console.error("Failed to persist signal:", error);
		}
	};

	const persistedSet: Setter<T> = (value) => {
		const result = set(value);
		saveState(get());
		return result;
	};

	return [get, persistedSet];
};
