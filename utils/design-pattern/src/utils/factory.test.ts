import { describe, expect, it } from "vitest";
import { factory, factoryWithParams } from "./factory";

describe("factory", () => {
	it("should create instance using factory function", () => {
		const createProduct = factory(() => ({ id: 1, name: "Product" }));

		const product = createProduct();

		expect(product).toEqual({ id: 1, name: "Product" });
	});

	it("should create instance with parameters", () => {
		const createProduct = factoryWithParams((id: number, name: string) => ({ id, name }));

		const product = createProduct(1, "Test Product");

		expect(product).toEqual({ id: 1, name: "Test Product" });
	});
});
