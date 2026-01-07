import { describe, expect, it } from "vitest";
import { createRoutesDts } from "./dts";
import { RESOLVED_VIRTUAL_ROUTES_ID, VIRTUAL_ROUTES_ID } from "./virtual";

describe("vitext-vite/dts", () => {
	it("generates d.ts for virtual routes module", () => {
		const dts = createRoutesDts();
		expect(dts).toContain("declare module \"virtual:vitext/routes\"");
		expect(dts).toContain("WRouteRecord");
	});
});

describe("vitext-vite/virtual ids", () => {
	it("prefixes resolved id with \0", () => {
		expect(VIRTUAL_ROUTES_ID).toBe("virtual:vitext/routes");
		expect(RESOLVED_VIRTUAL_ROUTES_ID.startsWith("\\0")).toBe(true);
	});
});
