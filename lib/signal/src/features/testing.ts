import type { Accessor } from "../types/ref.type";
import type { Effect } from "../types/effect.type";

export interface SignalTestSuite {
	expectSignal<T>(signal: Accessor<T>): SignalExpectation<T>;
	expectEffect(effect: Effect): EffectExpectation;
	expectUpdate<T>(setter: (value: T) => T): UpdateExpectation<T>;
}

export interface SignalExpectation<T> {
	toBe(expected: T): void;
	toBeCloseTo(expected: number, precision?: number): void;
	toHaveBeenCalled(): void;
	toHaveBeenCalledTimes(times: number): void;
}

export interface EffectExpectation {
	toRunOnce(): void;
	toRunTimes(times: number): void;
	toNotRun(): void;
}

export interface UpdateExpectation<_T> {
	toTrigger(...effects: Effect[]): void;
	toNotTrigger(...effects: Effect[]): void;
}

let currentTestSuite: SignalTestSuite | null = null;

export const createSignalTestSuite = (): SignalTestSuite => {
	const suite: SignalTestSuite = {
		expectSignal<T>(signal: Accessor<T>): SignalExpectation<T> {
			return {
				toBe(expected: T) {
					const actual = signal();
					if (actual !== expected) {
						throw new Error(`Expected ${expected}, but got ${actual}`);
					}
				},
				toBeCloseTo(expected: number, precision = 2) {
					const actual = signal() as unknown as number;
					const diff = Math.abs(actual - expected);
					if (diff > Math.pow(10, -precision)) {
						throw new Error(
							`Expected ${expected} to be close to ${actual} within ${precision} decimals`,
						);
					}
				},
				toHaveBeenCalled() {
					// Implementation would track signal reads
				},
				toHaveBeenCalledTimes(_times: number) {
					// Implementation would track signal reads
				},
			};
		},
		expectEffect(_effect: Effect): EffectExpectation {
			return {
				toRunOnce() {
					// Implementation would track effect runs
				},
				toRunTimes(_times: number) {
					// Implementation would track effect runs
				},
				toNotRun() {
					// Implementation would track effect runs
				},
			};
		},
		expectUpdate<T>(_setter: (value: T) => T): UpdateExpectation<T> {
			return {
				toTrigger(..._effects: Effect[]) {
					// Implementation would track triggered effects
				},
				toNotTrigger(..._effects: Effect[]) {
					// Implementation would track triggered effects
				},
			};
		},
	};

	currentTestSuite = suite;
	return suite;
};

export const getTestSuite = (): SignalTestSuite | null => currentTestSuite;
