import { describe, expect, it } from "vitest";
import { string, number } from "../src";
import { merge } from "../src/utils/merge";

describe("Merge Schema", () => {
	it("should merge two object schemas", () => {
		const schema1 = { shape: { name: string() } };
		const schema2 = { shape: { age: number() } };

		const schema = merge({ schema1, schema2 });

		const result = schema.parse({ name: "John", age: 30 });
		expect(result.success).toBe(true);
		if (!result.success) {
			return;
		}
		expect(result.data).toEqual({ name: "John", age: 30 });
	});

	it("should merge multiple object schemas", () => {
		const schema1 = { shape: { name: string() } };
		const schema2 = { shape: { age: number() } };
		const schema3 = { shape: { email: string() } };

		const schema12 = merge({ schema1, schema2 });
		const schema123 = merge({ schema1: schema12, schema2: schema3 });

		const result = schema123.parse({ name: "John", age: 30, email: "john@example.com" });
		expect(result.success).toBe(true);
	});

	it("should override properties from later schemas", () => {
		const schema1 = { shape: { name: string() } };
		const schema2 = { shape: { name: string({ min: 5 }) } };

		const schema = merge({ schema1, schema2 });

		const result = schema.parse({ name: "John" });
		expect(result.success).toBe(true);
	});

	it("should fail if input is not an object", () => {
		const schema1 = { shape: { name: string() } };
		const schema2 = { shape: { age: number() } };

		const schema = merge({ schema1, schema2 });

		const result = schema.parse("not an object");
		expect(result.success).toBe(false);
	});

	it("should collect all validation errors", () => {
		const schema1 = { shape: { name: string() } };
		const schema2 = { shape: { age: number() } };

		const schema = merge({ schema1, schema2 });

		const result = schema.parse({ name: 123, age: "invalid" });
		expect(result.success).toBe(false);
		expect(result.issues.length).toBeGreaterThan(0);
	});

	it("should support custom error message", () => {
		const schema1 = { shape: { name: string() } };
		const schema2 = { shape: { age: number() } };

		const schema = merge({ schema1, schema2, message: "Custom error" });

		const result = schema.parse("not an object");
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.issues[0].message).toBe("Custom error");
		}
	});

	it("should support custom name", () => {
		const schema1 = { shape: { name: string() } };
		const schema2 = { shape: { age: number() } };

		const schema = merge({ schema1, schema2, name: "MergedSchema" });

		expect(schema._metadata.name).toBe("MergedSchema");
	});
});
