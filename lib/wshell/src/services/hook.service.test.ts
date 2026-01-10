import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import { HookService, HookServiceLive } from "../services/hook.service";
import { Hook } from "../types/hook";

describe("HookService", () => {
	const runPromise = <E, A>(effect: Effect.Effect<A, E, HookService>) =>
		Effect.runPromise(effect.pipe(Effect.provide(HookServiceLive)));

	it("should register a hook", async () => {
		const program = HookService.pipe(
			Effect.flatMap((service) =>
				service.registerHook(
					Hook.make({
						name: "test-hook",
						type: "before",
						handler: "() => console.log('test')",
					}),
				),
			),
			Effect.flatMap(() => HookService.pipe(Effect.flatMap((s) => s.listHooks()))),
		);
		const result = await runPromise(program);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0].name).toBe("test-hook");
	});

	it("should unregister a hook", async () => {
		const program = HookService.pipe(
			Effect.flatMap((service) =>
				service.registerHook(
					Hook.make({
						name: "temp-hook",
						type: "before",
						handler: "() => console.log('temp')",
					}),
				),
			),
			Effect.flatMap(() => HookService.pipe(Effect.flatMap((s) => s.unregisterHook("temp-hook")))),
			Effect.flatMap(() => HookService.pipe(Effect.flatMap((s) => s.listHooks()))),
		);
		const result = await runPromise(program);
		expect(result.find((h) => h.name === "temp-hook")).toBeUndefined();
	});

	it("should list all hooks", async () => {
		const program = HookService.pipe(Effect.flatMap((s) => s.listHooks()));
		const result = await runPromise(program);
		expect(Array.isArray(result)).toBe(true);
	});
});
