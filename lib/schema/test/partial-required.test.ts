import { describe, expect, it } from "vitest";
import { string, number } from "../src";
import { partial, required } from "../src/utils/partial-required";

describe("Partial/Required Schema", () => {
	describe("partial", () => {
		it("should make all fields optional", () => {
			const schema = partial({
				shape: {
					name: string(),
					age: number(),
				},
			});

			const result1 = schema.parse({ name: "John" });
			expect(result1.success).toBe(true);

			const result2 = schema.parse({ age: 30 });
			expect(result2.success).toBe(true);

			const result3 = schema.parse({});
			expect(result3.success).toBe(true);

			const result4 = schema.parse({ name: "John", age: 30 });
			expect(result4.success).toBe(true);
		});

		it("should validate present fields", () => {
			const schema = partial({
				shape: {
					name: string(),
					age: number(),
				},
			});

			const result = schema.parse({ name: 123 });
			expect(result.success).toBe(false);
		});

		it("should fail if input is not an object", () => {
			const schema = partial({
				shape: {
					name: string(),
				},
			});

			const result = schema.parse("not an object");
			expect(result.success).toBe(false);
		});
	});

	describe("required", () => {
		it("should make all fields required", () => {
			const schema = required({
				shape: {
					name: string(),
					age: number(),
				},
			});

			const result = schema.parse({ name: "John", age: 30 });
			expect(result.success).toBe(true);
		});

		it("should fail if required field is missing", () => {
			const schema = required({
				shape: {
					name: string(),
					age: number(),
				},
			});

			const result = schema.parse({ name: "John" });
			expect(result.success).toBe(false);
		});

		it("should validate field types", () => {
			const schema = required({
				shape: {
					name: string(),
					age: number(),
				},
			});

			const result = schema.parse({ name: "John", age: "invalid" });
			expect(result.success).toBe(false);
		});

		it("should fail if input is not an object", () => {
			const schema = required({
				shape: {
					name: string(),
				},
			});

			const result = schema.parse("not an object");
			expect(result.success).toBe(false);
		});
	});
});
