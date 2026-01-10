import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import { HistoryService, HistoryServiceLive } from "../services/history.service";
import { ConfigServiceLive } from "../services/config.service";

describe("HistoryService", () => {
	const runPromise = <E, A>(effect: Effect.Effect<A, E, HistoryService>) =>
		Effect.runPromise(effect.pipe(Effect.provide(HistoryServiceLive), Effect.provide(ConfigServiceLive)));

	it("should add entry to history", async () => {
		const program = HistoryService.pipe(
			Effect.flatMap((service) => service.addEntry("ls -la")),
			Effect.flatMap(() => HistoryService.pipe(Effect.flatMap((s) => s.getAll()))),
		);
		const result = await runPromise(program);
		expect(result.length).toBeGreaterThan(0);
		expect(result[result.length - 1].command).toBe("ls -la");
	});

	it("should clear history", async () => {
		const program = HistoryService.pipe(
			Effect.flatMap((service) => service.addEntry("test")),
			Effect.flatMap(() => HistoryService.pipe(Effect.flatMap((s) => s.clear()))),
			Effect.flatMap(() => HistoryService.pipe(Effect.flatMap((s) => s.getAll()))),
		);
		const result = await runPromise(program);
		expect(result.length).toBe(0);
	});

	it("should search history", async () => {
		const program = HistoryService.pipe(
			Effect.flatMap((service) => service.addEntry("git status")),
			Effect.flatMap(() => HistoryService.pipe(Effect.flatMap((s) => s.search("git")))),
		);
		const result = await runPromise(program);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0].command).toContain("git");
	});
});
