import { describe, expect, it } from "vitest";
import { string } from "../src";
import { withAsync, asyncRefine } from "../src/utils/async";

describe("Async Validation", () => {
	describe("withAsync", () => {
		it("should add parseAsync method to schema", async () => {
			const schema = withAsync(string());

			expect(schema.parseAsync).toBeDefined();

			const result = await schema.parseAsync("hello");
			expect(result.success).toBe(true);
			expect(result.data).toBe("hello");
		});

		it("should fallback to parse if parseAsyncInternal is not defined", async () => {
			const schema = withAsync(string());

			const result = await schema.parseAsync("test");
			expect(result.success).toBe(true);
		});

		it("should handle parse errors", async () => {
			const schema = withAsync(string());

			const result = await schema.parseAsync(123);
			expect(result.success).toBe(false);
			expect(result.issues).toHaveLength(1);
		});
	});

	describe("asyncRefine", () => {
		it("should pass async refinement", async () => {
			const schema = asyncRefine(string(), async (value) => {
				return value.length > 5;
			});

			const result = await schema.parseAsync("hello world");
			expect(result.success).toBe(true);
		});

		it("should fail async refinement", async () => {
			const schema = asyncRefine(string(), async (value) => {
				return value.length > 10;
			});

			const result = await schema.parseAsync("hello");
			expect(result.success).toBe(false);
			expect(result.issues).toHaveLength(1);
		});

		it("should support custom error message", async () => {
			const schema = asyncRefine(string(), async (value) => {
				return value.length > 10 ? true : "Too short";
			});

			const result = await schema.parseAsync("hello");
			expect(result.success).toBe(false);
			expect(result.issues[0].message).toBe("Too short");
		});

		it("should support multiple issues", async () => {
			const schema = asyncRefine(string(), async (value) => {
				if (value.length < 5) {
					return [{ message: "Too short", path: [] }];
				}
				if (value.length > 20) {
					return [{ message: "Too long", path: [] }];
				}
				return true;
			});

			const result1 = await schema.parseAsync("hi");
			expect(result1.success).toBe(false);
			expect(result1.issues[0].message).toBe("Too short");

			const result2 = await schema.parseAsync("this is a very long string that exceeds limit");
			expect(result2.success).toBe(false);
			expect(result2.issues[0].message).toBe("Too long");
		});

		it("should combine with regular parse validation", async () => {
			const schema = asyncRefine(string({ min: 5 }), async (value) => {
				return value.length > 10;
			});

			const result1 = await schema.parseAsync("hi");
			expect(result1.success).toBe(false);

			const result2 = await schema.parseAsync("hello");
			expect(result2.success).toBe(false);

			const result3 = await schema.parseAsync("hello world");
			expect(result3.success).toBe(true);
		});
	});

	describe("withAsync + asyncRefine", () => {
		it("should work together", async () => {
			const schema = asyncRefine(withAsync(string()), async (value) => {
				return value.length > 5;
			});

			const result = await schema.parseAsync("hello world");
			expect(result.success).toBe(true);
		});
	});
});
