import { describe, expect, it } from "vitest";
import { singleton } from "./singleton";

describe("singleton", () => {
	it("should return the same instance", () => {
		let count = 0;
		const getInstance = singleton(() => {
			count++;
			return { value: count };
		});

		const instance1 = getInstance();
		const instance2 = getInstance();

		expect(instance1).toBe(instance2);
		expect(instance1.value).toBe(1);
		expect(instance2.value).toBe(1);
	});
});
