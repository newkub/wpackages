import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSignal } from "./use-signal.hook";

describe("useSignal", () => {
	it("should initialize with default value", () => {
		const { result } = renderHook(() => useSignal(0));
		const [getter] = result.current;

		expect(getter()).toBe(0);
	});

	it("should update value", () => {
		const { result } = renderHook(() => useSignal(0));
		const [getter, setter] = result.current;

		act(() => {
			setter(5);
		});

		expect(getter()).toBe(5);
	});

	it("should update with function", () => {
		const { result } = renderHook(() => useSignal(0));
		const [getter, setter] = result.current;

		act(() => {
			setter((c) => c + 1);
		});

		expect(getter()).toBe(1);
	});

	it("should respect equality check", () => {
		const { result } = renderHook(() =>
			useSignal([], { equals: (a, b) => a.length === b.length }),
		);
		const [getter, setter] = result.current;

		act(() => {
			setter([1, 2, 3]);
		});

		expect(getter()).toEqual([1, 2, 3]);
	});
});
