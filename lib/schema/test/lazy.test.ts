import { describe, expect, it } from "vitest";
import { string, number, object } from "../src";
import { lazy } from "../src/utils/lazy";

describe("Lazy Evaluation & Recursive Schemas", () => {
	describe("lazy", () => {
		it("should defer schema creation until first use", () => {
			let callCount = 0;
			const schema = lazy(() => {
				callCount++;
				return string();
			});

			expect(callCount).toBe(0);

			schema.parse("hello");
			expect(callCount).toBe(1);

			schema.parse("world");
			expect(callCount).toBe(1);
		});

		it("should support recursive schemas", () => {
			let nodeSchema: any;
			nodeSchema = lazy(() =>
				object({
					shape: {
						value: number(),
						left: nodeSchema.optional(),
						right: nodeSchema.optional(),
					},
				}),
			);

			const result = nodeSchema.parse({
				value: 1,
				left: { value: 2 },
				right: { value: 3, left: { value: 4 } },
			});

			expect(result.success).toBe(true);
		});

		it("should propagate optional method", () => {
			const schema = lazy(() => string()).optional();

			const result1 = schema.parse("hello");
			expect(result1.success).toBe(true);

			const result2 = schema.parse(undefined);
			expect(result2.success).toBe(true);
		});

		it("should propagate transform method", () => {
			const schema = lazy(() => string()).transform((s) => s.toUpperCase());

			const result = schema.parse("hello");
			expect(result.success).toBe(true);
			expect(result.data).toBe("HELLO");
		});

		it("should propagate refine method", () => {
			const schema = lazy(() => string()).refine((s) => s.length > 5);

			const result1 = schema.parse("hello world");
			expect(result1.success).toBe(true);

			const result2 = schema.parse("hi");
			expect(result2.success).toBe(false);
		});

		it("should propagate default method", () => {
			const schema = lazy(() => string()).default("default");

			const result = schema.parse(undefined);
			expect(result.success).toBe(true);
			expect(result.data).toBe("default");
		});

		it("should propagate description method", () => {
			const schema = lazy(() => string()).description("A string field");

			expect(schema._metadata.description).toBe("A string field");
		});

		it("should propagate examples method", () => {
			const schema = lazy(() => string()).examples("hello", "world");

			expect(schema._metadata.examples).toEqual(["hello", "world"]);
		});

		it("should propagate metadata method", () => {
			const schema = lazy(() => string()).metadata({ custom: "value" });

			expect(schema._metadata.custom).toBe("value");
		});

		it("should support async parsing", async () => {
			const schema = lazy(() => string());

			expect(schema.parseAsync).toBeDefined();
			const result = await schema.parseAsync!("hello");
			expect(result.success).toBe(true);
		});

		it("should handle parse errors correctly", () => {
			const schema = lazy(() => string());

			const result = schema.parse(123);
			expect(result.success).toBe(false);
			expect(result.issues).toHaveLength(1);
		});
	});

	describe("Complex recursive structures", () => {
		it("should handle nested objects", () => {
			const simpleSchema = lazy(() =>
				object({
					shape: {
						value: number(),
						children: lazy(() => simpleSchema).optional(),
					},
				}),
			);

			const result = simpleSchema.parse({
				value: 1,
				children: {
					value: 2,
					children: { value: 3 },
				},
			});

			expect(result.success).toBe(true);
		});
	});
});
