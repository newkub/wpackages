import { describe, expect, it } from "vitest";
import { clone, prototype } from "./prototype";

describe("prototype", () => {
	it("should create clone from prototype", () => {
		const original = { id: 1, name: "Original" };
		const createClone = prototype(original);

		const clone1 = createClone();
		const clone2 = createClone();

		expect(clone1).toEqual(original);
		expect(clone2).toEqual(original);
		expect(clone1).not.toBe(original);
	});

	it("should clone object directly", () => {
		const original = { id: 1, name: "Original" };
		const cloned = clone(original);

		expect(cloned).toEqual(original);
		expect(cloned).not.toBe(original);
	});
});
