import type { SerializedState, HydrationOptions } from "../types";
import { deserializeState, reviveSignal, registerSignal, unregisterSignal } from "./serialization.service";

const hydratedSignals = new Map<string, unknown>();

export function hydrateState(
	serialized: string | SerializedState,
	options?: HydrationOptions,
): void {
	const state = deserializeState(serialized, options);

	for (const signal of state.signals) {
		try {
			const value = reviveSignal(signal, options);
			hydratedSignals.set(signal.id, value);
		} catch (error) {
			console.error(`Failed to hydrate signal ${signal.id}:`, error);
		}
	}
}

export function getHydratedValue(id: string): unknown {
	return hydratedSignals.get(id);
}

export function hasHydratedValue(id: string): boolean {
	return hydratedSignals.has(id);
}

export function clearHydratedState(): void {
	hydratedSignals.clear();
}

export function getHydratedSignalIds(): string[] {
	return Array.from(hydratedSignals.keys());
}

export function getHydratedSignalCount(): number {
	return hydratedSignals.size;
}

export function createHydratedSignal<T>(
	id: string,
	initialValue: T,
	_options?: HydrationOptions,
): { getter: () => T; setter: (value: T) => void } {
	const hydratedValue = getHydratedValue(id) as T | undefined;
	const value = hydratedValue !== undefined ? hydratedValue : initialValue;

	let currentValue = value;

	const getter = (): T => {
		return currentValue;
	};

	const setter = (newValue: T): void => {
		currentValue = newValue;
	};

	registerSignal(id, getter);

	return {
		getter,
		setter,
	};
}

export function disposeHydratedSignal(id: string): void {
	unregisterSignal(id);
	hydratedSignals.delete(id);
}

export function validateHydration(
	serialized: string | SerializedState,
	options?: HydrationOptions,
): boolean {
	try {
		const state = deserializeState(serialized, options);

		if (!state.signals || !Array.isArray(state.signals)) {
			return false;
		}

		if (!state.version || typeof state.version !== "string") {
			return false;
		}

		if (!state.timestamp || typeof state.timestamp !== "number") {
			return false;
		}

		return true;
	} catch {
		return false;
	}
}

export function mergeHydration(
	existing: string | SerializedState,
	updated: string | SerializedState,
	options?: HydrationOptions,
): SerializedState {
	const existingState = deserializeState(existing, options);
	const updatedState = deserializeState(updated, options);

	const mergedSignals = new Map<string, unknown>();

	for (const signal of existingState.signals) {
		mergedSignals.set(signal.id, signal.value);
	}

	for (const signal of updatedState.signals) {
		mergedSignals.set(signal.id, signal.value);
	}

	const mergedState: SerializedState = {
		signals: Array.from(mergedSignals.entries()).map(([id, value]) => ({
			id,
			value,
			version: Date.now(),
		})),
		version: updatedState.version,
		timestamp: Date.now(),
	};

	return mergedState;
}
