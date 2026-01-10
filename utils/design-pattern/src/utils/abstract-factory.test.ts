import { describe, expect, it } from "vitest";
import { abstractFactory, factoryFamily } from "./abstract-factory";

describe("abstract-factory", () => {
	it("should create product using abstract factory", () => {
		const factory = abstractFactory(() => ({ type: "Product" }));

		const product = factory.create();

		expect(product).toEqual({ type: "Product" });
	});

	it("should manage multiple factories", () => {
		const buttonFactory = abstractFactory(() => ({ type: "button" }));
		const inputFactory = abstractFactory(() => ({ type: "input" }));

		const factories = factoryFamily({
			button: buttonFactory,
			input: inputFactory,
		});

		expect(factories.button.create()).toEqual({ type: "button" });
		expect(factories.input.create()).toEqual({ type: "input" });
	});
});
