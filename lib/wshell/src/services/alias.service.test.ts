import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import { AliasService, AliasServiceLive } from "../services/alias.service";
import { ConfigServiceLive } from "../services/config.service";

describe("AliasService", () => {
	const runPromise = <E, A>(effect: Effect.Effect<A, E, AliasService>) =>
		Effect.runPromise(effect.pipe(Effect.provide(AliasServiceLive), Effect.provide(ConfigServiceLive)));

	it("should add alias", async () => {
		const program = AliasService.pipe(
			Effect.flatMap((service) => service.addAlias("ll", "ls -la")),
			Effect.flatMap(() => AliasService.pipe(Effect.flatMap((s) => s.getAlias("ll")))),
		);
		const result = await runPromise(program);
		expect(result).not.toBeNull();
		expect(result?.command).toBe("ls -la");
	});

	it("should list aliases", async () => {
		const program = AliasService.pipe(
			Effect.flatMap((service) => service.addAlias("g", "git")),
			Effect.flatMap(() => AliasService.pipe(Effect.flatMap((s) => s.listAliases()))),
		);
		const result = await runPromise(program);
		expect(result.length).toBeGreaterThan(0);
	});

	it("should expand alias", async () => {
		const program = AliasService.pipe(
			Effect.flatMap((service) => service.addAlias("ll", "ls -la")),
			Effect.flatMap(() => AliasService.pipe(Effect.flatMap((s) => s.expandAlias("ll")))),
		);
		const result = await runPromise(program);
		expect(result).toBe("ls -la");
	});

	it("should remove alias", async () => {
		const program = AliasService.pipe(
			Effect.flatMap((service) => service.addAlias("test", "echo test")),
			Effect.flatMap(() => AliasService.pipe(Effect.flatMap((s) => s.removeAlias("test")))),
			Effect.flatMap(() => AliasService.pipe(Effect.flatMap((s) => s.getAlias("test")))),
		);
		const result = await runPromise(program);
		expect(result).toBeNull();
	});
});
