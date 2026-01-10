import { describe, expect, it } from "vitest";
import { string, number } from "../src";
import { conditional } from "../src/types/conditional";

describe("Conditional Schema", () => {
	it("should select schema based on condition", () => {
		const schema = conditional({
			condition: (input: unknown) => {
				if (typeof input === "string") {
					return string();
				}
				if (typeof input === "number") {
					return number();
				}
				return null;
			},
		});

		const result1 = schema.parse("hello");
		expect(result1.success).toBe(true);

		const result2 = schema.parse(123);
		expect(result2.success).toBe(true);
	});

	it("should fail if no matching schema", () => {
		const schema = conditional({
			condition: (input: unknown) => {
				if (typeof input === "string") {
					return string();
				}
				return null;
			},
		});

		const result = schema.parse(123);
		expect(result.success).toBe(false);
	});

	it("should support custom error message", () => {
		const schema = conditional({
			condition: (input: unknown) => {
				if (typeof input === "string") {
					return string();
				}
				return null;
			},
			message: "No matching schema",
		});

		const result = schema.parse(123);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.issues[0].message).toBe("No matching schema");
		}
	});

	it("should support custom name", () => {
		const schema = conditional({
			condition: (input: unknown) => {
				if (typeof input === "string") {
					return string();
				}
				return null;
			},
			name: "StringOrNumber",
		});

		expect(schema._metadata.name).toBe("StringOrNumber");
	});
});
