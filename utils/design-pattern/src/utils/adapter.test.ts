import { describe, expect, it } from "vitest";
import { adapter } from "./adapter";

describe("adapter", () => {
	it("should adapt input to output", () => {
		const adapt = adapter((x: number) => x.toString());
		expect(adapt(42)).toBe("42");
	});
});
