import { describe, expect, it } from "vitest";
import { strategy } from "./strategy";

describe("strategy", () => {
	it("should execute selected strategy", () => {
		const strategies = {
			add: (a: number, b: number) => a + b,
			subtract: (a: number, b: number) => a - b,
			multiply: (a: number, b: number) => a * b,
		};

		const executeStrategy = strategy(strategies);

		expect(executeStrategy("add", 2, 3)).toBe(5);
		expect(executeStrategy("subtract", 5, 3)).toBe(2);
		expect(executeStrategy("multiply", 2, 3)).toBe(6);
	});

	it("should throw error for non-existent strategy", () => {
		const strategies = {
			add: (a: number, b: number) => a + b,
		};

		const executeStrategy = strategy(strategies);

		expect(() => executeStrategy("divide", 4, 2)).toThrow("Strategy \"divide\" not found");
	});
});
