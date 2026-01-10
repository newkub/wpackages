import { describe, expect, it, vi } from "vitest";
import { useResource } from "./use-resource.composable";

describe("useResource", () => {
	it("should initialize with loading state", () => {
		const fetchFn = vi.fn(() => Promise.resolve("data"));
		const [data, { loading }] = useResource(fetchFn);

		expect(loading()).toBe(true);
		expect(data()).toBeUndefined();
	});

	it("should resolve data", async () => {
		const fetchFn = vi.fn(() => Promise.resolve("data"));
		const [data, { loading }] = useResource(fetchFn);

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(loading()).toBe(false);
		expect(data()).toBe("data");
	});

	it("should handle errors", async () => {
		const fetchFn = vi.fn(() => Promise.reject(new Error("Failed")));
		const [data, { loading, error }] = useResource(fetchFn);

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(loading()).toBe(false);
		expect(error()).toBeInstanceOf(Error);
	});

	it("should refetch data", async () => {
		let count = 0;
		const fetchFn = vi.fn(() => Promise.resolve(`data-${++count}`));
		const [data, { refetch }] = useResource(fetchFn);

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(data()).toBe("data-1");

		await refetch();

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(data()).toBe("data-2");
	});
});
