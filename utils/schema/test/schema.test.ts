import { describe, expect, it } from "vitest";
import { formatIssues, object, string } from "../src";

describe("string schema", () => {
	it("should parse a valid string", () => {
		const schema = string();
		const result = schema.parse("hello");
		expect(result).toEqual({ success: true, data: "hello" });
	});

	it("should fail for a non-string value", () => {
		const schema = string();
		const result = schema.parse(123);
		expect(result.success).toBe(false);
	});

	it("should handle min length validation", () => {
		const schema = string({ min: 5 });
		const result = schema.parse("hi");
		expect(result.success).toBe(false);
	});
});

describe("formatIssues", () => {
	it("should format issues with path", () => {
		const output = formatIssues([
			{ message: "Required", path: ["a", 0, "b"] },
			{ message: "Invalid", path: [] },
		]);
		expect(output).toBe("- a.0.b: Required\n- <root>: Invalid");
	});
});

describe("object unknownKeys", () => {
	it("should strip unknown keys by default", () => {
		const schema = object({ shape: { a: string() } });
		const result = schema.parse({ a: "x", extra: "y" });
		expect(result).toEqual({ success: true, data: { a: "x" } });
	});

	it("should passthrough unknown keys when configured", () => {
		const schema = object({ shape: { a: string() }, unknownKeys: "passthrough" });
		const result = schema.parse({ a: "x", extra: "y" });
		expect(result).toEqual({ success: true, data: { a: "x", extra: "y" } });
	});

	it("should error on unknown keys when strict", () => {
		const schema = object({ shape: { a: string() }, unknownKeys: "strict" });
		const result = schema.parse({ a: "x", extra: "y" });
		expect(result).toEqual({
			success: false,
			issues: [{ message: "Unknown key: extra", path: ["extra"] }],
		});
	});
});
