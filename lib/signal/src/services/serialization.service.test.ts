import { describe, it, expect, beforeEach } from "vitest";
import {
	registerSignal,
	unregisterSignal,
	generateSignalId,
	serializeState,
	serializeToString,
	serializeToJSON,
	deserializeState,
	reviveSignal,
	clearRegisteredSignals,
	getRegisteredSignalCount,
	getRegisteredSignalIds,
} from "./serialization.service";

describe("Serialization Service", () => {
	beforeEach(() => {
		clearRegisteredSignals();
	});

	describe("registerSignal", () => {
		it("should register a signal", () => {
			const getter = () => 42;
			registerSignal("test-1", getter);

			expect(getRegisteredSignalCount()).toBe(1);
			expect(getRegisteredSignalIds()).toContain("test-1");
		});

		it("should allow multiple registrations", () => {
			registerSignal("test-1", () => 1);
			registerSignal("test-2", () => 2);
			registerSignal("test-3", () => 3);

			expect(getRegisteredSignalCount()).toBe(3);
		});
	});

	describe("unregisterSignal", () => {
		it("should unregister a signal", () => {
			registerSignal("test-1", () => 42);
			unregisterSignal("test-1");

			expect(getRegisteredSignalCount()).toBe(0);
		});
	});

	describe("generateSignalId", () => {
		it("should generate unique IDs", () => {
			const id1 = generateSignalId();
			const id2 = generateSignalId();
			const id3 = generateSignalId();

			expect(id1).not.toBe(id2);
			expect(id2).not.toBe(id3);
			expect(id1).not.toBe(id3);
		});
	});

	describe("serializeState", () => {
		it("should serialize registered signals", () => {
			registerSignal("test-1", () => 42);
			registerSignal("test-2", () => "hello");

			const state = serializeState();

			expect(state.signals).toHaveLength(2);
			expect(state.signals[0].value).toBe(42);
			expect(state.signals[1].value).toBe("hello");
		});

		it("should include metadata", () => {
			registerSignal("test-1", () => 42);

			const state = serializeState();

			expect(state.version).toBe("1.0.0");
			expect(state.timestamp).toBeGreaterThan(0);
		});
	});

	describe("serializeToString", () => {
		it("should serialize to JSON string", () => {
			registerSignal("test-1", () => 42);

			const state = serializeState();
			const serialized = serializeToString(state);

			expect(typeof serialized).toBe("string");
			expect(JSON.parse(serialized)).toHaveProperty("signals");
		});
	});

	describe("serializeToJSON", () => {
		it("should serialize to formatted JSON", () => {
			registerSignal("test-1", () => 42);

			const state = serializeState();
			const serialized = serializeToJSON(state);

			expect(typeof serialized).toBe("string");
			expect(serialized).toContain("\n");
		});
	});

	describe("deserializeState", () => {
		it("should deserialize from string", () => {
			const state = {
				signals: [{ id: "test-1", value: 42, version: Date.now() }],
				version: "1.0.0",
				timestamp: Date.now(),
			};

			const serialized = JSON.stringify(state);
			const deserialized = deserializeState(serialized);

			expect(deserialized.signals).toHaveLength(1);
			expect(deserialized.signals[0].value).toBe(42);
		});

		it("should deserialize from object", () => {
			const state = {
				signals: [{ id: "test-1", value: 42, version: Date.now() }],
				version: "1.0.0",
				timestamp: Date.now(),
			};

			const deserialized = deserializeState(state);

			expect(deserialized.signals).toHaveLength(1);
		});
	});

	describe("reviveSignal", () => {
		it("should revive signal value", () => {
			const signal = {
				id: "test-1",
				value: 42,
				version: Date.now(),
			};

			const revived = reviveSignal(signal);

			expect(revived).toBe(42);
		});

		it("should apply revive function", () => {
			const signal = {
				id: "test-1",
				value: "42",
				version: Date.now(),
			};

			const revived = reviveSignal(signal, {
				revive: (value) => Number(value),
			});

			expect(revived).toBe(42);
		});
	});

	describe("clearRegisteredSignals", () => {
		it("should clear all registered signals", () => {
			registerSignal("test-1", () => 1);
			registerSignal("test-2", () => 2);

			clearRegisteredSignals();

			expect(getRegisteredSignalCount()).toBe(0);
		});
	});
});
