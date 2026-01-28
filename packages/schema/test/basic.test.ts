/**
 * Basic tests for schema validation
 */

import { describe, expect, it } from "vitest";
import {
	array,
	boolean,
	date,
	discriminatedUnion,
	discriminatedUnionMap,
	email,
	enum_,
	intersection,
	literal,
	never,
	number,
	object,
	record,
	SchemaValidationError,
	string,
	tuple,
	union,
} from "../src/index.js";

describe("Primitive schemas", () => {
	it("should validate strings", () => {
		const schema = string();
		expect(schema.parse("hello")).toEqual({ success: true, data: "hello" });
		expect(schema.parse(123)).toEqual({
			success: false,
			error: expect.objectContaining({ code: "invalid_type" }),
		});
	});

	it("should validate numbers", () => {
		const schema = number();
		expect(schema.parse(42)).toEqual({ success: true, data: 42 });
		expect(schema.parse("42")).toEqual({
			success: false,
			error: expect.objectContaining({ code: "invalid_type" }),
		});
	});

	it("should validate booleans", () => {
		const schema = boolean();
		expect(schema.parse(true)).toEqual({ success: true, data: true });
		expect(schema.parse("true")).toEqual({
			success: false,
			error: expect.objectContaining({ code: "invalid_type" }),
		});
	});
});

describe("Other primitive schemas", () => {
	it("should validate date", () => {
		const schema = date();
		const valid = new Date();
		const invalid = new Date("invalid");

		expect(schema.parse(valid)).toEqual({ success: true, data: valid });
		expect(schema.parse(invalid)).toEqual({
			success: false,
			error: expect.objectContaining({ code: "invalid_date" }),
		});
		expect(schema.parse("2020-01-01")).toEqual({
			success: false,
			error: expect.objectContaining({ code: "invalid_type" }),
		});
	});

	it("should validate literal", () => {
		const schema = literal("a");
		expect(schema.parse("a")).toEqual({ success: true, data: "a" });
		expect(schema.parse("b")).toEqual({
			success: false,
			error: expect.objectContaining({ code: "invalid_literal" }),
		});
	});

	it("should validate never", () => {
		const schema = never();
		expect(schema.parse("anything")).toEqual({
			success: false,
			error: expect.objectContaining({ code: "invalid_type" }),
		});
	});
});

describe("Other composite schemas", () => {
	it("should validate enum", () => {
		const schema = enum_({ A: "a", B: "b" });
		expect(schema.parse("a")).toEqual({ success: true, data: "a" });
		expect(schema.parse("c")).toEqual({
			success: false,
			error: expect.objectContaining({ code: "invalid_enum" }),
		});
	});

	it("should validate tuple", () => {
		const schema = tuple([string(), number()] as const);
		expect(schema.parse(["x", 1])).toEqual({ success: true, data: ["x", 1] });
		expect(schema.parse(["x"])).toEqual({
			success: false,
			error: expect.objectContaining({ code: "invalid_tuple" }),
		});
	});

	it("should validate record", () => {
		const schema = record(number());
		expect(schema.parse({ a: 1, b: 2 })).toEqual({ success: true, data: { a: 1, b: 2 } });
		expect(schema.parse({ a: "1" })).toEqual({
			success: false,
			error: expect.objectContaining({ code: "invalid_record" }),
		});
	});

	it("should validate intersection", () => {
		const a = object({ a: number() });
		const b = object({ b: string() });
		const schema = intersection(a, b);

		expect(schema.parse({ a: 1, b: "x" })).toEqual({ success: true, data: { a: 1, b: "x" } });
		expect(schema.parse({ a: 1 })).toEqual({
			success: false,
			error: expect.anything(),
		});
	});
});

describe("Composite schemas", () => {
	it("should validate objects", () => {
		const schema = object({
			name: string(),
			age: number(),
		});

		expect(schema.parse({ name: "John", age: 30 })).toEqual({
			success: true,
			data: { name: "John", age: 30 },
		});

		expect(schema.parse({ name: "John", age: "30" })).toEqual({
			success: false,
			error: expect.objectContaining({ code: "invalid_object" }),
		});
	});

	it("should validate arrays", () => {
		const schema = array(string());

		expect(schema.parse(["a", "b", "c"])).toEqual({
			success: true,
			data: ["a", "b", "c"],
		});

		expect(schema.parse([1, 2, 3])).toEqual({
			success: false,
			error: expect.objectContaining({ code: "invalid_array" }),
		});
	});

	it("should validate unions", () => {
		const schema = union([string(), number()]);

		expect(schema.parse("hello")).toEqual({ success: true, data: "hello" });
		expect(schema.parse(42)).toEqual({ success: true, data: 42 });
		expect(schema.parse(true)).toEqual({
			success: false,
			error: expect.objectContaining({ code: "invalid_union" }),
		});
	});
});

describe("Optional and nullable", () => {
	it("should handle optional values", () => {
		const schema = string().optional();

		expect(schema.parse("hello")).toEqual({ success: true, data: "hello" });
		expect(schema.parse(undefined)).toEqual({ success: true, data: undefined });
		expect(schema.parse(null)).toEqual({
			success: false,
			error: expect.objectContaining({ code: "invalid_type" }),
		});
	});

	it("should handle nullable values", () => {
		const schema = string().nullable();

		expect(schema.parse("hello")).toEqual({ success: true, data: "hello" });
		expect(schema.parse(null)).toEqual({ success: true, data: null });
		expect(schema.parse(undefined)).toEqual({
			success: false,
			error: expect.objectContaining({ code: "invalid_type" }),
		});
	});
});

describe("DX helpers", () => {
	it("should support parseOrThrow", () => {
		const schema = number();
		expect(schema.parseOrThrow(1)).toBe(1);
		expect(() => schema.parseOrThrow("1")).toThrow(SchemaValidationError);
	});

	it("should support assert", () => {
		const schema = string();
		const value: unknown = "hello";
		schema.assert(value);
		expect(value).toBe("hello");
	});

	it("should support default values", () => {
		const schema = string().default("x");
		expect(schema.parse(undefined)).toEqual({ success: true, data: "x" });
		expect(schema.parse("y")).toEqual({ success: true, data: "y" });
	});

	it("should support default factory", () => {
		const schema = number().default(() => 1);
		expect(schema.parse(undefined)).toEqual({ success: true, data: 1 });
	});

	it("default should apply before optional", () => {
		const schema = string().optional().default("x");
		expect(schema.parse(undefined)).toEqual({ success: true, data: "x" });
	});
});

describe("Object key policies", () => {
	it("should strip unknown keys by default", () => {
		const schema = object({ name: string() });
		const result = schema.parse({ name: "a", extra: 1 });
		expect(result).toEqual({ success: true, data: { name: "a" } });
	});

	it("should passthrough unknown keys", () => {
		const schema = object({ name: string() }).passthrough();
		const result = schema.parse({ name: "a", extra: 1 });
		expect(result).toEqual({ success: true, data: { name: "a", extra: 1 } });
	});

	it("should be strict about unknown keys", () => {
		const schema = object({ name: string() }).strict();
		const result = schema.parse({ name: "a", extra: 1 });
		expect(result).toEqual({
			success: false,
			error: expect.objectContaining({ code: "invalid_object" }),
		});
	});
});

describe("Discriminated union", () => {
	it("should validate based on discriminator", () => {
		const a = object({ type: string(), a: number() });
		const b = object({ type: string(), b: string() });
		const schema = discriminatedUnion("type", [a, b]);

		expect(schema.parse({ type: "a", a: 1 })).toEqual({ success: true, data: { type: "a", a: 1 } });
		expect(schema.parse({ type: "b", b: "x" })).toEqual({ success: true, data: { type: "b", b: "x" } });
	});

	it("should validate based on discriminator map", () => {
		const a = object({ type: string(), a: number() });
		const b = object({ type: string(), b: string() });
		const schema = discriminatedUnionMap("type", { a, b });

		expect(schema.parse({ type: "a", a: 1 })).toEqual({ success: true, data: { type: "a", a: 1 } });
		expect(schema.parse({ type: "b", b: "x" })).toEqual({ success: true, data: { type: "b", b: "x" } });
		expect(schema.parse({ type: "c" })).toEqual({
			success: false,
			error: expect.objectContaining({ code: "invalid_discriminator" }),
		});
	});
});

describe("Validation utilities", () => {
	it("should validate email", () => {
		const schema = email();

		expect(schema.parse("test@example.com")).toEqual({
			success: true,
			data: "test@example.com",
		});

		expect(schema.parse("invalid")).toEqual({
			success: false,
			error: expect.objectContaining({ code: "custom" }),
		});
	});

	it("should validate min/max", () => {
		const schema = number().refine((n) => n >= 0, "Must be positive");

		expect(schema.parse(5)).toEqual({ success: true, data: 5 });
		expect(schema.parse(-1)).toEqual({
			success: false,
			error: expect.objectContaining({ code: "custom" }),
		});
	});
});
