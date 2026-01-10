import { describe, expect, it } from "vitest";
import { proxy } from "./proxy";

describe("proxy", () => {
	it("should intercept property access", () => {
		const target = { value: 42 };
		const handler: ProxyHandler<typeof target> = {
			get: (obj, prop) => {
				if (prop === "value") {
					return obj.value * 2;
				}
				return obj[prop as keyof typeof obj];
			},
		};

		const proxyInstance = proxy(target, handler);

		expect(proxyInstance.value).toBe(84);
	});

	it("should intercept property assignment", () => {
		const target = { value: 0 };
		const handler: ProxyHandler<typeof target> = {
			set: (obj, prop, value) => {
				if (prop === "value") {
					obj.value = value * 2;
					return true;
				}
				return false;
			},
		};

		const proxyInstance = proxy(target, handler);

		proxyInstance.value = 5;
		expect(target.value).toBe(10);
	});
});
