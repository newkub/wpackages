import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import { CompletionService, CompletionServiceLive } from "../services/completion.service";

describe("CompletionService", () => {
	const runPromise = <E, A>(effect: Effect.Effect<A, E, CompletionService>) =>
		Effect.runPromise(effect.pipe(Effect.provide(CompletionServiceLive)));

	it("should complete commands", async () => {
		const program = CompletionService.pipe(Effect.flatMap((service) => service.completeCommand("l")));
		const result = await runPromise(program);
		expect(result.length).toBeGreaterThan(0);
		expect(result.some((item) => item.label === "ls")).toBe(true);
	});

	it("should complete environment variables", async () => {
		const program = CompletionService.pipe(Effect.flatMap((service) => service.completeEnvVar("PA")));
		const result = await runPromise(program);
		expect(result.length).toBeGreaterThan(0);
		expect(result.some((item) => item.label === "$PATH")).toBe(true);
	});

	it("should get suggestions for commands", async () => {
		const program = CompletionService.pipe(Effect.flatMap((service) => service.getSuggestions("he")));
		const result = await runPromise(program);
		expect(result.length).toBeGreaterThan(0);
		expect(result.some((item) => item.label === "help")).toBe(true);
	});

	it("should filter suggestions", async () => {
		const program = CompletionService.pipe(
			Effect.flatMap((service) => service.completeCommand("l")),
			Effect.flatMap((suggestions) => CompletionService.pipe(Effect.flatMap((s) => s.filterSuggestions(suggestions, "ls")))),
		);
		const result = await runPromise(program);
		expect(result.length).toBe(1);
		expect(result[0].label).toBe("ls");
	});
});
