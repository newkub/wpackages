import type { SerializedSignal, SerializedState, HydrationOptions } from "../types";

const registeredSignals = new Map<string, () => unknown>();
let signalVersion = 0;

export function registerSignal(id: string, getter: () => unknown): void {
	registeredSignals.set(id, getter);
}

export function unregisterSignal(id: string): void {
	registeredSignals.delete(id);
}

export function generateSignalId(): string {
	return `signal-${++signalVersion}`;
}

export function serializeSignal(id: string, getter: () => unknown): SerializedSignal {
	return {
		id,
		value: getter(),
		version: Date.now(),
	};
}

export function serializeState(options?: HydrationOptions): SerializedState {
	const signals: SerializedSignal[] = [];

	for (const [id, getter] of registeredSignals.entries()) {
		try {
			const signal = serializeSignal(id, getter);
			signals.push(signal);
		} catch (error) {
			console.error(`Failed to serialize signal ${id}:`, error);
		}
	}

	const state: SerializedState = {
		signals,
		version: "1.0.0",
		timestamp: Date.now(),
	};

	if (options?.validate) {
		if (!options.validate(state)) {
			throw new Error("Serialized state validation failed");
		}
	}

	return state;
}

export function serializeToString(state: SerializedState): string {
	return JSON.stringify(state);
}

export function serializeToJSON(state: SerializedState): string {
	return JSON.stringify(state, null, 2);
}

export function deserializeState(
	serialized: string | SerializedState,
	options?: HydrationOptions,
): SerializedState {
	let state: SerializedState;

	if (typeof serialized === "string") {
		try {
			state = JSON.parse(serialized);
		} catch (error) {
			throw new Error(`Failed to parse serialized state: ${error}`);
		}
	} else {
		state = serialized;
	}

	if (options?.validate) {
		if (!options.validate(state)) {
			throw new Error("Deserialized state validation failed");
		}
	}

	return state;
}

export function reviveSignal(
	signal: SerializedSignal,
	options?: HydrationOptions,
): unknown {
	let value = signal.value;

	if (options?.revive) {
		try {
			value = options.revive(value);
		} catch (error) {
			console.error(`Failed to revive signal ${signal.id}:`, error);
		}
	}

	return value;
}

export function clearRegisteredSignals(): void {
	registeredSignals.clear();
}

export function getRegisteredSignalCount(): number {
	return registeredSignals.size;
}

export function getRegisteredSignalIds(): string[] {
	return Array.from(registeredSignals.keys());
}
