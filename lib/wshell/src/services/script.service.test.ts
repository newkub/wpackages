import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import { ScriptService, ScriptServiceLive } from "../services/script.service";
import { Script } from "../types/script";
import { ParserServiceLive } from "../services/parser.service";
import { ExecutorServiceLive } from "../services/executor.service";

describe("ScriptService", () => {
	const runPromise = <E, A>(effect: Effect.Effect<A, E, ScriptService>) =>
		Effect.runPromise(
			effect.pipe(
				Effect.provide(ScriptServiceLive),
				Effect.provide(ParserServiceLive),
				Effect.provide(ExecutorServiceLive),
			),
		);

	it("should parse script content", async () => {
		const program = ScriptService.pipe(
			Effect.flatMap((s) =>
				s.parseScript(`# Test script
echo "Hello"
ls`),
			),
		);
		const result = await runPromise(program);
		expect(result.content).toContain('echo "Hello"');
	});

	it("should validate script", async () => {
		const program = ScriptService.pipe(
			Effect.flatMap((s) =>
				s.validateScript(
					Script.make({
						path: "test.wsh",
						content: "echo test",
						args: [],
					}),
				),
			),
		);
		const result = await runPromise(program);
		expect(result.content).toBe("echo test");
	});
});
