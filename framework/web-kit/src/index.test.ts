import { describe, expect, test } from "bun:test";

import { ApiBuilder, PluginsSystem, Schema, Validator, WebServer, WebServerServices, WRouter } from "./index";

describe("@wpackages/web-kit", () => {
	test("exports are available", () => {
		expect(ApiBuilder).toBeDefined();
		expect(PluginsSystem).toBeDefined();
		expect(Schema).toBeDefined();
		expect(Validator).toBeDefined();
		expect(WebServer).toBeDefined();
		expect(WebServerServices).toBeDefined();
		expect(WRouter).toBeDefined();
	});
});
