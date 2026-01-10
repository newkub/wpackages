import { describe, expect, it } from "vitest";
import { decorator } from "./decorator";

describe("decorator", () => {
	it("should add decorators to target object", () => {
		const target = {
			greet: () => "Hello",
		};

		const decorated = decorator(target, {
			greet: () => "Hello, decorated!",
		});

		expect(decorated.greet()).toBe("Hello, decorated!");
	});

	it("should return original method if not decorated", () => {
		const target = {
			greet: () => "Hello",
			farewell: () => "Goodbye",
		};

		const decorated = decorator(target, {});

		expect(decorated.greet()).toBe("Hello");
		expect(decorated.farewell()).toBe("Goodbye");
	});
});
