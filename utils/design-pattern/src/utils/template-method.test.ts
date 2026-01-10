import { describe, expect, it } from "vitest";
import { TemplateMethod } from "./template-method";

class ConcreteTemplate extends TemplateMethod {
	step1(): string {
		return "Step 1";
	}

	step2(): string {
		return "Step 2";
	}

	step3(): string {
		return "Step 3";
	}
}

describe("template-method", () => {
	it("should execute steps in order", () => {
		const template = new ConcreteTemplate();

		const result = template.execute();

		expect(result).toBe("Step 1 -> Step 2 -> Step 3");
	});
});
