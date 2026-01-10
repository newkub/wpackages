import { describe, expect, it } from "vitest";
import { Composite, leaf } from "./composite";

describe("composite", () => {
	it("should compose multiple components", () => {
		const leaf1 = leaf("Leaf 1");
		const leaf2 = leaf("Leaf 2");
		const composite = new Composite();

		composite.add(leaf1);
		composite.add(leaf2);

		const result = composite.operation();

		expect(result).toContain("Leaf: Leaf 1");
		expect(result).toContain("Leaf: Leaf 2");
	});

	it("should remove components", () => {
		const leaf1 = leaf("Leaf 1");
		const leaf2 = leaf("Leaf 2");
		const composite = new Composite();

		composite.add(leaf1);
		composite.add(leaf2);
		composite.remove(leaf1);

		const result = composite.operation();

		expect(result).not.toContain("Leaf: Leaf 1");
		expect(result).toContain("Leaf: Leaf 2");
	});
});
