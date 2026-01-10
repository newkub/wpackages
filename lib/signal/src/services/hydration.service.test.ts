import { describe, it, expect, beforeEach } from "vitest";
import {
	hydrateState,
	getHydratedValue,
	hasHydratedValue,
	createHydratedSignal,
	disposeHydratedSignal,
	clearHydratedState,
	getHydratedSignalIds,
	getHydratedSignalCount,
	validateHydration,
	mergeHydration,
} from "./hydration.service";

describe("Hydration Service", () => {
	beforeEach(() => {
		clearHydratedState();
	});

	describe("hydrateState", () => {
		it("should hydrate state from object", () => {
			const state = {
				signals: [
					{ id: "test-1", value: 42, version: Date.now() },
					{ id: "test-2", value: "hello", version: Date.now() },
				],
				version: "1.0.0",
				timestamp: Date.now(),
			};

			hydrateState(state);

			expect(getHydratedValue("test-1")).toBe(42);
			expect(getHydratedValue("test-2")).toBe("hello");
		});

		it("should hydrate state from string", () => {
			const state = {
				signals: [{ id: "test-1", value: 42, version: Date.now() }],
				version: "1.0.0",
				timestamp: Date.now(),
			};

			hydrateState(JSON.stringify(state));

			expect(getHydratedValue("test-1")).toBe(42);
		});
	});

	describe("getHydratedValue", () => {
		it("should return hydrated value", () => {
			const state = {
				signals: [{ id: "test-1", value: 42, version: Date.now() }],
				version: "1.0.0",
				timestamp: Date.now(),
			};

			hydrateState(state);

			expect(getHydratedValue("test-1")).toBe(42);
		});

		it("should return undefined for non-existent signal", () => {
			expect(getHydratedValue("non-existent")).toBeUndefined();
		});
	});

	describe("hasHydratedValue", () => {
		it("should return true for hydrated signals", () => {
			const state = {
				signals: [{ id: "test-1", value: 42, version: Date.now() }],
				version: "1.0.0",
				timestamp: Date.now(),
			};

			hydrateState(state);

			expect(hasHydratedValue("test-1")).toBe(true);
		});

		it("should return false for non-existent signals", () => {
			expect(hasHydratedValue("non-existent")).toBe(false);
		});
	});

	describe("createHydratedSignal", () => {
		it("should create signal with hydrated value", () => {
			const state = {
				signals: [{ id: "test-1", value: 42, version: Date.now() }],
				version: "1.0.0",
				timestamp: Date.now(),
			};

			hydrateState(state);

			const { getter } = createHydratedSignal("test-1", 0);

			expect(getter()).toBe(42);
		});

		it("should use initial value if not hydrated", () => {
			const { getter } = createHydratedSignal("test-1", 99);

			expect(getter()).toBe(99);
		});
	});

	describe("disposeHydratedSignal", () => {
		it("should dispose hydrated signal", () => {
			const state = {
				signals: [{ id: "test-1", value: 42, version: Date.now() }],
				version: "1.0.0",
				timestamp: Date.now(),
			};

			hydrateState(state);
			createHydratedSignal("test-1", 0);
			disposeHydratedSignal("test-1");

			expect(hasHydratedValue("test-1")).toBe(false);
		});
	});

	describe("clearHydratedState", () => {
		it("should clear all hydrated values", () => {
			const state = {
				signals: [
					{ id: "test-1", value: 1, version: Date.now() },
					{ id: "test-2", value: 2, version: Date.now() },
				],
				version: "1.0.0",
				timestamp: Date.now(),
			};

			hydrateState(state);
			clearHydratedState();

			expect(getHydratedSignalCount()).toBe(0);
		});
	});

	describe("validateHydration", () => {
		it("should validate valid state", () => {
			const state = {
				signals: [{ id: "test-1", value: 42, version: Date.now() }],
				version: "1.0.0",
				timestamp: Date.now(),
			};

			expect(validateHydration(state)).toBe(true);
		});

		it("should reject invalid state", () => {
			const state = {
				signals: "invalid",
				version: "1.0.0",
				timestamp: Date.now(),
			};

			expect(validateHydration(state)).toBe(false);
		});
	});

	describe("mergeHydration", () => {
		it("should merge two states", () => {
			const state1 = {
				signals: [{ id: "test-1", value: 1, version: Date.now() }],
				version: "1.0.0",
				timestamp: Date.now(),
			};

			const state2 = {
				signals: [{ id: "test-2", value: 2, version: Date.now() }],
				version: "1.0.0",
				timestamp: Date.now(),
			};

			const merged = mergeHydration(state1, state2);

			expect(merged.signals).toHaveLength(2);
			expect(merged.signals[0].value).toBe(1);
			expect(merged.signals[1].value).toBe(2);
		});

		it("should override existing values", () => {
			const state1 = {
				signals: [{ id: "test-1", value: 1, version: Date.now() }],
				version: "1.0.0",
				timestamp: Date.now(),
			};

			const state2 = {
				signals: [{ id: "test-1", value: 2, version: Date.now() }],
				version: "1.0.0",
				timestamp: Date.now(),
			};

			const merged = mergeHydration(state1, state2);

			expect(merged.signals).toHaveLength(1);
			expect(merged.signals[0].value).toBe(2);
		});
	});
});
