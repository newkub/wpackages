import { describe, expect, it } from "vitest";
import { fisherYatesShuffle } from "../src/utils/fisher-yates-shuffle";

describe("fisherYatesShuffle", () => {
	it("should return an array with the same length", () => {
		const arr = [1, 2, 3, 4, 5];
		const shuffled = fisherYatesShuffle(arr);
		expect(shuffled).toHaveLength(arr.length);
	});

	it("should return an array with the same elements", () => {
		const arr = [1, 2, 3, 4, 5];
		const shuffled = fisherYatesShuffle(arr);
		expect(shuffled.sort()).toEqual(arr.sort());
	});

	it("should not modify the original array", () => {
		const arr = [1, 2, 3, 4, 5];
		fisherYatesShuffle(arr);
		expect(arr).toEqual([1, 2, 3, 4, 5]);
	});

	it("should handle an empty array", () => {
		expect(fisherYatesShuffle([])).toEqual([]);
	});

	it("should handle an array with one element", () => {
		expect(fisherYatesShuffle([1])).toEqual([1]);
	});
});
