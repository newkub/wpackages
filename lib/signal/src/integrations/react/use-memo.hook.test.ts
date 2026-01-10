import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMemo, useComputed } from "./use-memo.hook";

describe("useMemo", () => {
	it("should compute value", () => {
		const { result } = renderHook(() => useMemo(() => 2 * 2, []));

		expect(result.current()).toBe(4);
	});

	it("should recompute when dependencies change", () => {
		const { result, rerender } = renderHook(({ count }) => useMemo(() => count * 2, []), {
			initialProps: { count: 2 },
		});

		expect(result.current()).toBe(4);

		rerender({ count: 3 });

		expect(result.current()).toBe(6);
	});
});

describe("useComputed", () => {
	it("should return computed value", () => {
		const { result } = renderHook(() => useComputed(() => 2 * 2));

		expect(result.current).toBe(4);
	});
});
