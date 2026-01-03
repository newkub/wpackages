import { rimraf } from "rimraf";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup } from "./cleanup.service";

vi.mock("rimraf", () => ({
	rimraf: vi.fn(),
}));

describe("cleanup service", () => {
	beforeEach(() => {
		vi.spyOn(console, "log").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should delete specified targets", async () => {
		const targets = ["/test/node_modules", "/test/dist"];
		(rimraf as vi.Mock).mockResolvedValue(true as any);

		const results = await cleanup(targets);

		expect(rimraf).toHaveBeenCalledTimes(2);
		expect(rimraf).toHaveBeenCalledWith("/test/node_modules");
		expect(rimraf).toHaveBeenCalledWith("/test/dist");
		expect(results).toEqual([
			{ status: "fulfilled", path: "/test/node_modules" },
			{ status: "fulfilled", path: "/test/dist" },
		]);
	});

	it("should handle cleanup failures", async () => {
		const targets = ["/test/dist"];
		const error = new Error("Permission denied");

		(rimraf as vi.Mock).mockRejectedValue(error);

		const results = await cleanup(targets);

		expect(rimraf).toHaveBeenCalledWith("/test/dist");
		expect(results).toEqual([
			{ status: "rejected", path: "/test/dist", reason: error },
		]);
	});
});
