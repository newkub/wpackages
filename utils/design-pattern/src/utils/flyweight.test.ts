import { describe, expect, it } from "vitest";
import { flyweightFactory } from "./flyweight";

describe("flyweight", () => {
	it("should reuse existing flyweight", () => {
		const factory = flyweightFactory();

		const flyweight1 = factory.getFlyweight("shared", () => ({ data: "shared" }));
		const flyweight2 = factory.getFlyweight("shared", () => ({ data: "shared" }));

		expect(flyweight1).toBe(flyweight2);
		expect(factory.getSize()).toBe(1);
	});

	it("should create new flyweight for different keys", () => {
		const factory = flyweightFactory();

		const flyweight1 = factory.getFlyweight("key1", () => ({ data: "1" }));
		const flyweight2 = factory.getFlyweight("key2", () => ({ data: "2" }));

		expect(flyweight1).not.toBe(flyweight2);
		expect(factory.getSize()).toBe(2);
	});
});
