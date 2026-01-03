import { describe, expect, it } from "vitest";
import { createHeap, extract, insert, isEmpty, maxComparator, minComparator, peek } from "./heap";

describe("Immutable Min Heap", () => {
	it("should insert values and maintain heap property", () => {
		const heap0 = createHeap<number>();
		const heap1 = insert(heap0, 10, minComparator);
		const heap2 = insert(heap1, 5, minComparator);
		const heap3 = insert(heap2, 15, minComparator);
		const heap4 = insert(heap3, 3, minComparator);

		expect(peek(heap0)).toBeNull();
		expect(peek(heap1)).toBe(10);
		expect(peek(heap2)).toBe(5);
		expect(peek(heap3)).toBe(5);
		expect(peek(heap4)).toBe(3);
	});

	it("should extract the minimum value and maintain heap property", () => {
		let heap = createHeap<number>();
		heap = insert(heap, 10, minComparator);
		heap = insert(heap, 5, minComparator);
		heap = insert(heap, 15, minComparator);
		heap = insert(heap, 3, minComparator);

		const [val1, heap1] = extract(heap, minComparator);
		expect(val1).toBe(3);
		expect(peek(heap1)).toBe(5);

		const [val2, heap2] = extract(heap1, minComparator);
		expect(val2).toBe(5);
		expect(peek(heap2)).toBe(10);

		const [val3, heap3] = extract(heap2, minComparator);
		expect(val3).toBe(10);
		expect(peek(heap3)).toBe(15);

		const [val4, heap4] = extract(heap3, minComparator);
		expect(val4).toBe(15);
		expect(isEmpty(heap4)).toBe(true);

		const [val5, heap5] = extract(heap4, minComparator);
		expect(val5).toBeNull();
		expect(heap4).toBe(heap5);
	});
});

describe("Immutable Max Heap", () => {
	it("should extract the maximum value", () => {
		let heap = createHeap<number>();
		heap = insert(heap, 10, maxComparator);
		heap = insert(heap, 5, maxComparator);
		heap = insert(heap, 15, maxComparator);
		heap = insert(heap, 3, maxComparator);

		const [val1, heap1] = extract(heap, maxComparator);
		expect(val1).toBe(15);
		expect(peek(heap1)).toBe(10);
	});
});
