import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import { PluginService, PluginServiceLive } from "../services/plugin.service";
import { ConfigServiceLive } from "../services/config.service";

describe("PluginService", () => {
	const runPromise = <E, A>(effect: Effect.Effect<A, E, PluginService>) =>
		Effect.runPromise(effect.pipe(Effect.provide(PluginServiceLive), Effect.provide(ConfigServiceLive)));

	it("should list plugins", async () => {
		const program = PluginService.pipe(Effect.flatMap((s) => s.listPlugins()));
		const result = await runPromise(program);
		expect(Array.isArray(result)).toBe(true);
	});

	it("should get plugin by name", async () => {
		const program = PluginService.pipe(Effect.flatMap((s) => s.getPlugin("non-existent")));
		const result = await runPromise(program);
		expect(result).toBeNull();
	});
});
