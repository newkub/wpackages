import { describe, it, expect } from "vitest";
import { useSignal } from "./use-signal.composable";

describe("useSignal", () => {
	it("should initialize with default value", () => {
		const [getter] = useSignal(0);

		expect(getter()).toBe(0);
	});

	it("should update value", () => {
		const [getter, setter] = useSignal(0);

		setter(5);

		expect(getter()).toBe(5);
	});

	it("should update with function", () => {
		const [getter, setter] = useSignal(0);

		setter((c) => c + 1);

		expect(getter()).toBe(1);
	});

	it("should respect equality check", () => {
		const [getter, setter] = useSignal([], {
			equals: (a, b) => a.length === b.length,
		});

		setter([1, 2, 3]);

		expect(getter()).toEqual([1, 2, 3]);
	});
});
