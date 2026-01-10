/**
 * Mock Data Generator Tests
 */

import { describe, it, expect } from "vitest";
import { string, number, boolean, object, array, literal, union, intersection } from "../src";
import { mock, mockMany, mockEdgeCases } from "../src/generators/mock";

describe("Mock Data Generator", () => {
	describe("mock()", () => {
		it("should generate mock data for string schema", () => {
			const schema = string({ min: 2, max: 10 });
			const data = mock(schema);

			expect(typeof data).toBe("string");
			expect(data.length).toBeGreaterThanOrEqual(2);
			expect(data.length).toBeLessThanOrEqual(10);
		});

		it("should generate mock data for number schema", () => {
			const schema = number({ min: 0, max: 100 });
			const data = mock(schema);

			expect(typeof data).toBe("number");
			expect(data).toBeGreaterThanOrEqual(0);
			expect(data).toBeLessThanOrEqual(100);
		});

		it("should generate mock data for boolean schema", () => {
			const schema = boolean();
			const data = mock(schema);

			expect(typeof data).toBe("boolean");
			expect([true, false]).toContain(data);
		});

		it("should generate mock data for literal schema", () => {
			const schema = literal("hello");
			const data = mock(schema);

			expect(data).toBe("hello");
		});

		it("should generate mock data for object schema", () => {
			const schema = object({
				shape: {
					name: string({ min: 1 }),
					age: number({ min: 0, max: 150 }),
					isActive: boolean(),
				},
			});
			const data = mock(schema);

			expect(typeof data).toBe("object");
			expect(data).not.toBeNull();
			expect(typeof data.name).toBe("string");
			expect(typeof data.age).toBe("number");
			expect(typeof data.isActive).toBe("boolean");
		});

		it("should generate mock data for array schema", () => {
			const schema = array({ item: number() });
			const data = mock(schema);

			expect(Array.isArray(data)).toBe(true);
			expect(data.length).toBeGreaterThan(0);
			expect(data.length).toBeLessThanOrEqual(5);
			data.forEach((item) => {
				expect(typeof item).toBe("number");
			});
		});

		it("should generate mock data for union schema", () => {
			const schema = union([string(), number()]);
			const data = mock(schema);

			expect(typeof data === "string" || typeof data === "number").toBe(true);
		});

		it("should generate mock data for intersection schema", () => {
			const schema1 = object({
				shape: {
					name: string(),
				},
			});
			const schema2 = object({
				shape: {
					age: number(),
				},
			});
			const schema = intersection([schema1, schema2]);
			const data = mock(schema);

			expect(typeof data).toBe("object");
			expect(typeof data.name).toBe("string");
			expect(typeof data.age).toBe("number");
		});

		it("should generate consistent mock data with same seed", () => {
			const schema = string({ min: 5, max: 10 });
			const data1 = mock(schema, { seed: 42 });
			const data2 = mock(schema, { seed: 42 });

			expect(data1).toBe(data2);
		});

		it("should generate different mock data with different seeds", () => {
			const schema = string({ min: 5, max: 10 });
			const data1 = mock(schema, { seed: 1 });
			const data2 = mock(schema, { seed: 2 });

			expect(data1).not.toBe(data2);
		});

		it("should handle nested object schemas", () => {
			const schema = object({
				shape: {
					user: object({
						shape: {
							name: string(),
							profile: object({
								shape: {
									bio: string(),
									age: number(),
								},
							}),
						},
					}),
				},
			});
			const data = mock(schema);

			expect(typeof data.user).toBe("object");
			expect(typeof data.user.name).toBe("string");
			expect(typeof data.user.profile).toBe("object");
			expect(typeof data.user.profile.bio).toBe("string");
			expect(typeof data.user.profile.age).toBe("number");
		});

		it("should handle nested array schemas", () => {
			const schema = array({
				item: array({
					item: number(),
				}),
			});
			const data = mock(schema);

			expect(Array.isArray(data)).toBe(true);
			data.forEach((item) => {
				expect(Array.isArray(item)).toBe(true);
				item.forEach((num) => {
					expect(typeof num).toBe("number");
				});
			});
		});
	});

	describe("mockMany()", () => {
		it("should generate multiple mock data items", () => {
			const schema = string({ min: 5, max: 10 });
			const data = mockMany(schema, 5);

			expect(Array.isArray(data)).toBe(true);
			expect(data.length).toBe(5);
			data.forEach((item) => {
				expect(typeof item).toBe("string");
				expect(item.length).toBeGreaterThanOrEqual(5);
				expect(item.length).toBeLessThanOrEqual(10);
			});
		});

		it("should generate different mock data for each item", () => {
			const schema = string({ min: 5, max: 10 });
			const data = mockMany(schema, 10);

			const uniqueItems = new Set(data);
			expect(uniqueItems.size).toBeGreaterThan(1);
		});
	});

	describe("mockEdgeCases()", () => {
		it("should generate edge case mock data", () => {
			const schema = object({
				shape: {
					name: string({ min: 1 }),
					age: number({ min: 0, max: 100 }),
				},
			});
			const edgeCases = mockEdgeCases(schema);

			expect(Array.isArray(edgeCases)).toBe(true);
			expect(edgeCases.length).toBe(3);
			edgeCases.forEach((data) => {
				expect(typeof data).toBe("object");
				expect(typeof data.name).toBe("string");
				expect(typeof data.age).toBe("number");
			});
		});
	});

	describe("Validation", () => {
		it("should generate valid data that passes schema validation", () => {
			const schema = object({
				shape: {
					name: string({ min: 2, max: 50 }),
					age: number({ min: 0, max: 150 }),
					email: string({ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
				},
			});

			for (let i = 0; i < 100; i++) {
				const data = mock(schema, { seed: i });
				const result = schema.parse(data);

				expect(result.success).toBe(true);
			}
		});

		it("should generate valid data for complex nested schemas", () => {
			const schema = object({
				shape: {
					users: array({
						item: object({
							shape: {
								id: number(),
								name: string({ min: 1 }),
								tags: array({
									item: string({ min: 1 }),
								}),
							},
						}),
					}),
					metadata: object({
						shape: {
							count: number({ min: 0 }),
							enabled: boolean(),
						},
					}),
				},
			});

			for (let i = 0; i < 50; i++) {
				const data = mock(schema, { seed: i });
				const result = schema.parse(data);

				expect(result.success).toBe(true);
			}
		});
	});
});
