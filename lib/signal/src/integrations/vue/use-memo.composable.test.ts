import { describe, it, expect } from "vitest";
import { useMemo, useComputed } from "./use-memo.composable";

describe("useMemo", () => {
	it("should compute value", () => {
		const memo = useMemo(() => 2 * 2, []);

		expect(memo()).toBe(4);
	});

	it("should cache computed value", () => {
		let computeCount = 0;
		const memo = useMemo(() => {
			computeCount++;
			return 2 * 2;
		}, []);

		memo();
		memo();
		memo();

		expect(computeCount).toBe(1);
	});
});

describe("useComputed", () => {
	it("should return computed value", () => {
		const computed = useComputed(() => 2 * 2);

		expect(computed()).toBe(4);
	});
});
