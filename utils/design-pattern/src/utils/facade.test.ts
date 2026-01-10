import { describe, expect, it } from "vitest";
import { facade } from "./facade";

describe("facade", () => {
	it("should provide simplified interface to complex subsystem", () => {
		const operations = {
			operationA: () => "A",
			operationB: () => "B",
		};

		const facadeInstance = facade(operations);

		expect(facadeInstance.operationA()).toBe("A");
		expect(facadeInstance.operationB()).toBe("B");
	});

	it("should throw error for non-existent operation", () => {
		const operations = {
			operationA: () => "A",
		};

		const facadeInstance = facade(operations);

		expect(() => (facadeInstance as any).operationB()).toThrow("Operation operationB not found");
	});
});
