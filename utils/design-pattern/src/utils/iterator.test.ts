import { describe, expect, it } from "vitest";
import { iterator } from "./iterator";

describe("iterator", () => {
	it("should iterate over collection", () => {
		const collection = [1, 2, 3];
		const iter = iterator(collection);

		expect(iter.next().value).toBe(1);
		expect(iter.next().value).toBe(2);
		expect(iter.next().value).toBe(3);
		expect(iter.next().done).toBe(true);
	});

	it("should check if has next", () => {
		const collection = [1, 2];
		const iter = iterator(collection);

		expect(iter.hasNext()).toBe(true);
		iter.next();
		expect(iter.hasNext()).toBe(true);
		iter.next();
		expect(iter.hasNext()).toBe(false);
	});
});
