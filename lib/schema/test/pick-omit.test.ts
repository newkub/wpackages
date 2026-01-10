import { describe, expect, it } from "vitest";
import { string, number } from "../src";
import { pick, omit } from "../src/utils/pick-omit";

describe("Pick/Omit Schema", () => {
	describe("pick", () => {
		it("should pick only specified keys", () => {
			const schema = pick({
				shape: {
					name: string(),
					age: number(),
					email: string(),
				},
				keys: ["name", "age"],
			});

			const result = schema.parse({ name: "John", age: 30, email: "john@example.com" });
			expect(result.success).toBe(true);
			if (!result.success) {
				return;
			}
			expect(result.data).toEqual({ name: "John", age: 30 });
		});

		it("should validate picked fields", () => {
			const schema = pick({
				shape: {
					name: string(),
					age: number(),
				},
				keys: ["name", "age"],
			});

			const result = schema.parse({ name: 123, age: 30 });
			expect(result.success).toBe(false);
		});

		it("should fail if input is not an object", () => {
			const schema = pick({
				shape: {
					name: string(),
				},
				keys: ["name"],
			});

			const result = schema.parse("not an object");
			expect(result.success).toBe(false);
		});
	});

	describe("omit", () => {
		it("should omit specified keys", () => {
			const schema = omit({
				shape: {
					name: string(),
					age: number(),
					email: string(),
				},
				keys: ["email"],
			});

			const result = schema.parse({ name: "John", age: 30, email: "john@example.com" });
			expect(result.success).toBe(true);
			if (!result.success) {
				return;
			}
			expect(result.data).toEqual({ name: "John", age: 30 });
		});

		it("should validate remaining fields", () => {
			const schema = omit({
				shape: {
					name: string(),
					age: number(),
					email: string(),
				},
				keys: ["email"],
			});

			const result = schema.parse({ name: 123, age: 30, email: "john@example.com" });
			expect(result.success).toBe(false);
		});

		it("should fail if input is not an object", () => {
			const schema = omit({
				shape: {
					name: string(),
				},
				keys: ["age"],
			});

			const result = schema.parse("not an object");
			expect(result.success).toBe(false);
		});
	});
});
