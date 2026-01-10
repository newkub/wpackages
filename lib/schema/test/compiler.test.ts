/**
 * Schema Compiler Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { string, number, boolean, object, array, literal, union, intersection } from "../src";
import { compile, clearCompilerCache, getCompilerCacheSize } from "../src/core/compiler";
import { clearCache, getCache, setCache, getCacheSize, withCache } from "../src/core/cache";

describe("Schema Compiler", () => {
	beforeEach(() => {
		clearCompilerCache();
		clearCache();
	});

	describe("compile()", () => {
		it("should compile a string schema", () => {
			const schema = string({ min: 2, max: 10 });
			const validator = compile(schema);

			const result1 = validator("hello");
			expect(result1.success).toBe(true);
			if (result1.success) {
				expect(result1.data).toBe("hello");
			}

			const result2 = validator("a");
			expect(result2.success).toBe(false);
			if (!result2.success) {
				expect(result2.issues[0].message).toContain("at least 2");
			}
		});

		it("should compile a number schema", () => {
			const schema = number({ min: 0, max: 100 });
			const validator = compile(schema);

			const result1 = validator(50);
			expect(result1.success).toBe(true);
			if (result1.success) {
				expect(result1.data).toBe(50);
			}

			const result2 = validator(150);
			expect(result2.success).toBe(false);
			if (!result2.success) {
				expect(result2.issues[0].message).toContain("at most 100");
			}
		});

		it("should compile a boolean schema", () => {
			const schema = boolean();
			const validator = compile(schema);

			const result1 = validator(true);
			expect(result1.success).toBe(true);
			if (result1.success) {
				expect(result1.data).toBe(true);
			}

			const result2 = validator("true");
			expect(result2.success).toBe(false);
		});

		it("should compile an object schema", () => {
			const schema = object({
				shape: {
					name: string({ min: 1 }),
					age: number({ min: 0 }),
				},
			});
			const validator = compile(schema);

			const result1 = validator({ name: "John", age: 30 });
			expect(result1.success).toBe(true);
			if (result1.success) {
				expect(result1.data).toEqual({ name: "John", age: 30 });
			}

			const result2 = validator({ name: "", age: 30 });
			expect(result2.success).toBe(false);
		});

		it("should compile an array schema", () => {
			const schema = array({ item: number() });
			const validator = compile(schema);

			const result1 = validator([1, 2, 3]);
			expect(result1.success).toBe(true);
			if (result1.success) {
				expect(result1.data).toEqual([1, 2, 3]);
			}

			const result2 = validator([1, "2", 3]);
			expect(result2.success).toBe(false);
		});

		it("should compile a literal schema", () => {
			const schema = literal("hello");
			const validator = compile(schema);

			const result1 = validator("hello");
			expect(result1.success).toBe(true);
			if (result1.success) {
				expect(result1.data).toBe("hello");
			}

			const result2 = validator("world");
			expect(result2.success).toBe(false);
		});

		it("should compile a union schema", () => {
			const schema = union([string(), number()]);
			const validator = compile(schema);

			const result1 = validator("hello");
			expect(result1.success).toBe(true);

			const result2 = validator(42);
			expect(result2.success).toBe(true);

			const result3 = validator(true);
			expect(result3.success).toBe(false);
		});

		it("should compile an intersection schema", () => {
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
			const validator = compile(schema);

			const result1 = validator({ name: "John", age: 30 });
			expect(result1.success).toBe(true);

			const result2 = validator({ name: "John" });
			expect(result2.success).toBe(false);
		});

		it("should cache compiled validators", () => {
			const schema = string({ min: 2 });
			const validator1 = compile(schema);
			const validator2 = compile(schema);

			expect(validator1).toBe(validator2);
			expect(getCompilerCacheSize()).toBe(1);
		});

		it("should improve performance with compilation", () => {
			const schema = object({
				shape: {
					name: string({ min: 2, max: 50 }),
					age: number({ min: 0, max: 150 }),
					email: string({ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
				},
			});

			const validator = compile(schema);
			const data = { name: "John Doe", age: 30, email: "john@example.com" };

			const iterations = 10000;

			const startCompiled = performance.now();
			for (let i = 0; i < iterations; i++) {
				validator(data);
			}
			const endCompiled = performance.now();
			const compiledTime = endCompiled - startCompiled;

			const startUncompiled = performance.now();
			for (let i = 0; i < iterations; i++) {
				schema.parse(data);
			}
			const endUncompiled = performance.now();
			const uncompiledTime = endUncompiled - startUncompiled;

			expect(compiledTime).toBeLessThan(uncompiledTime);
		});
	});

	describe("clearCompilerCache()", () => {
		it("should clear the compiler cache", () => {
			const schema = string();
			compile(schema);
			expect(getCompilerCacheSize()).toBe(1);

			clearCompilerCache();
			expect(getCompilerCacheSize()).toBe(0);
		});
	});
});

describe("Schema Cache", () => {
	beforeEach(() => {
		clearCache();
	});

	describe("getCache() and setCache()", () => {
		it("should store and retrieve cached results", () => {
			const result = { success: true, data: "test" };
			setCache("test-key", result);

			const cached = getCache("test-key");
			expect(cached).toEqual(result);
		});

		it("should return undefined for non-existent keys", () => {
			const cached = getCache("non-existent");
			expect(cached).toBeUndefined();
		});
	});

	describe("clearCache()", () => {
		it("should clear all cached results", () => {
			setCache("key1", { success: true, data: "value1" });
			setCache("key2", { success: true, data: "value2" });
			expect(getCacheSize()).toBe(2);

			clearCache();
			expect(getCacheSize()).toBe(0);
		});
	});

	describe("withCache()", () => {
		it("should cache validation results", () => {
			const schema = string({ min: 2 });
			const cachedSchema = withCache(schema, (input) => String(input));

			const result1 = cachedSchema.parse("hello");
			expect(result1.success).toBe(true);

			const result2 = cachedSchema.parse("hello");
			expect(result2).toEqual(result1);
		});

		it("should not cache failed validations", () => {
			const schema = string({ min: 5 });
			const cachedSchema = withCache(schema, (input) => String(input));

			const result1 = cachedSchema.parse("hi");
			expect(result1.success).toBe(false);

			const result2 = cachedSchema.parse("hi");
			expect(result2).toEqual(result1);
		});
	});
});
