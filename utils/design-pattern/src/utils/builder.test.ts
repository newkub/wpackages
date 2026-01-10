import { describe, expect, it } from "vitest";
import { builder } from "./builder";

describe("builder", () => {
	it("should build object with fluent interface", () => {
		const product = builder<{ id: number; name: string; price: number }>()
			.set("id", 1)
			.set("name", "Product")
			.set("price", 100)
			.build();

		expect(product).toEqual({ id: 1, name: "Product", price: 100 });
	});

	it("should allow partial building", () => {
		const product = builder<{ id: number; name: string }>()
			.set("id", 1)
			.build();

		expect(product).toEqual({ id: 1 });
	});
});
