import { describe, expect, it } from "vitest";
import { bridge, type Implementation } from "./bridge";

describe("bridge", () => {
	it("should bridge abstraction to implementation", () => {
		const implementation: Implementation = {
			operationImplementation: () => "Implementation operation",
		};

		const abstraction = bridge(implementation);

		expect(abstraction.operation()).toBe("Implementation operation");
	});

	it("should allow changing implementation", () => {
		const impl1: Implementation = {
			operationImplementation: () => "Impl1",
		};
		const impl2: Implementation = {
			operationImplementation: () => "Impl2",
		};

		const abstraction1 = bridge(impl1);
		const abstraction2 = bridge(impl2);

		expect(abstraction1.operation()).toBe("Impl1");
		expect(abstraction2.operation()).toBe("Impl2");
	});
});
