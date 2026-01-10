import { describe, expect, it, vi } from "vitest";
import { ConcreteElementA, ConcreteElementB, ConcreteVisitor } from "./visitor";

describe("visitor", () => {
	it("should visit element A", () => {
		const element = new ConcreteElementA();
		const visitor = new ConcreteVisitor();

		const consoleSpy = vi.spyOn(console, "log");

		element.accept(visitor);

		expect(consoleSpy).toHaveBeenCalledWith("Visitor processing:", "Operation A");
	});

	it("should visit element B", () => {
		const element = new ConcreteElementB();
		const visitor = new ConcreteVisitor();

		const consoleSpy = vi.spyOn(console, "log");

		element.accept(visitor);

		expect(consoleSpy).toHaveBeenCalledWith("Visitor processing:", "Operation B");
	});
});
