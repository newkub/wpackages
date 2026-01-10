import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import { ConfigService, ConfigServiceLive } from "../services/config.service";

describe("ConfigService", () => {
	const runPromise = <E, A>(effect: Effect.Effect<A, E, ConfigService>) =>
		Effect.runPromise(effect.pipe(Effect.provide(ConfigServiceLive)));

	it("should get default config", async () => {
		const program = ConfigService.pipe(Effect.flatMap((service) => service.getConfig()));
		const result = await runPromise(program);
		expect(result).toBeDefined();
		expect(result.theme).toBe("default");
	});

	it("should validate config", async () => {
		const program = ConfigService.pipe(Effect.flatMap((service) => service.validateConfig({ theme: "test" })));
		const result = await runPromise(program);
		expect(result.theme).toBe("test");
	});
});
