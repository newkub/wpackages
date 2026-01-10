import type { Accessor } from "../types/ref.type";

export interface DiffPatch {
	op: "add" | "remove" | "replace";
	path: (string | number)[];
	value?: unknown;
	oldValue?: unknown;
}

export interface SignalDiffTracker<T> {
	readonly patches: DiffPatch[];
	readonly hasChanges: boolean;
	reset(): void;
	applyPatches(target: T): T;
}

const diffTrackers = new WeakMap<Accessor<unknown>, {
	previousValue: unknown;
	patches: DiffPatch[];
}>();

export const createSignalDiff = <T>(signal: Accessor<T>): SignalDiffTracker<T> => {
	const tracker = {
		previousValue: signal(),
		patches: [] as DiffPatch[],
	};

	diffTrackers.set(signal, tracker);

	return {
		get patches() {
			return tracker.patches as DiffPatch[];
		},
		get hasChanges() {
			return tracker.patches.length > 0;
		},
		reset() {
			tracker.previousValue = signal();
			tracker.patches = [];
		},
		applyPatches(target: T): T {
			let result = target;
			for (const patch of tracker.patches) {
				result = applyPatch(result, patch);
			}
			return result;
		},
	};
};

export const trackSignalChanges = <T>(signal: Accessor<T>): DiffPatch[] => {
	const tracker = diffTrackers.get(signal);
	if (!tracker) return [];

	const currentValue = signal();
	const patches = generateDiff(tracker.previousValue as T, currentValue);

	tracker.previousValue = currentValue;
	tracker.patches = patches;

	return patches;
};

export const generateDiff = <T>(oldValue: T, newValue: T): DiffPatch[] => {
	const patches: DiffPatch[] = [];

	if (oldValue === newValue) {
		return patches;
	}

	if (typeof oldValue !== "object" || oldValue === null) {
		patches.push({
			op: "replace",
			path: [],
			value: newValue,
			oldValue,
		});
		return patches;
	}

	if (typeof newValue !== "object" || newValue === null) {
		patches.push({
			op: "replace",
			path: [],
			value: newValue,
			oldValue,
		});
		return patches;
	}

	const oldKeys = new Set(Object.keys(oldValue as object));
	const newKeys = new Set(Object.keys(newValue as object));

	for (const key of newKeys) {
		if (!oldKeys.has(key)) {
			patches.push({
				op: "add",
				path: [key],
				value: (newValue as Record<string, unknown>)[key],
			});
		} else if (
			(oldValue as Record<string, unknown>)[key]
				!== (newValue as Record<string, unknown>)[key]
		) {
			patches.push({
				op: "replace",
				path: [key],
				value: (newValue as Record<string, unknown>)[key],
				oldValue: (oldValue as Record<string, unknown>)[key],
			});
		}
	}

	for (const key of oldKeys) {
		if (!newKeys.has(key)) {
			patches.push({
				op: "remove",
				path: [key],
				oldValue: (oldValue as Record<string, unknown>)[key],
			});
		}
	}

	return patches;
};

export const applyPatch = <T>(target: T, patch: DiffPatch): T => {
	if (patch.path.length === 0) {
		return patch.value as T;
	}

	let result = target as Record<string, unknown>;
	for (let i = 0; i < patch.path.length - 1; i++) {
		const key = patch.path[i];
		result = result[key] as Record<string, unknown>;
	}

	const lastKey = patch.path[patch.path.length - 1];

	switch (patch.op) {
		case "add":
		case "replace":
			result[lastKey] = patch.value;
			break;
		case "remove":
			delete result[lastKey];
			break;
	}

	return target as T;
};

export const applyPatches = <T>(target: T, patches: DiffPatch[]): T => {
	let result = target;
	for (const patch of patches) {
		result = applyPatch(result, patch);
	}
	return result;
};
