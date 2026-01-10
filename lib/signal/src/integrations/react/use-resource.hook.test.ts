import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useResource } from "./use-resource.hook";

describe("useResource", () => {
	it("should initialize with loading state", () => {
		const fetchFn = vi.fn(() => Promise.resolve("data"));
		const { result } = renderHook(() => useResource(fetchFn));

		const [data, { loading }] = result.current;

		expect(loading()).toBe(true);
		expect(data()).toBeUndefined();
	});

	it("should resolve data", async () => {
		const fetchFn = vi.fn(() => Promise.resolve("data"));
		const { result } = renderHook(() => useResource(fetchFn));

		await waitFor(() => {
			const [data, { loading }] = result.current;
			expect(loading()).toBe(false);
			expect(data()).toBe("data");
		});
	});

	it("should handle errors", async () => {
		const fetchFn = vi.fn(() => Promise.reject(new Error("Failed")));
		const { result } = renderHook(() => useResource(fetchFn));

		await waitFor(() => {
			const [, { loading, error }] = result.current;
			expect(loading()).toBe(false);
			expect(error()).toBeInstanceOf(Error);
		});
	});

	it("should refetch data", async () => {
		let count = 0;
		const fetchFn = vi.fn(() => Promise.resolve(`data-${++count}`));
		const { result } = renderHook(() => useResource(fetchFn));

		await waitFor(() => {
			const [data] = result.current;
			expect(data()).toBe("data-1");
		});

		const [, { refetch }] = result.current;
		await refetch();

		await waitFor(() => {
			const [data] = result.current;
			expect(data()).toBe("data-2");
		});
	});
});
