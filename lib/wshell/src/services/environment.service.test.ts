import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import { EnvironmentService, EnvironmentServiceLive } from "../services/environment.service";
import { ConfigServiceLive } from "../services/config.service";

describe("EnvironmentService", () => {
	const runPromise = <E, A>(effect: Effect.Effect<A, E, EnvironmentService>) =>
		Effect.runPromise(effect.pipe(Effect.provide(EnvironmentServiceLive), Effect.provide(ConfigServiceLive)));

	it("should set environment variable", async () => {
		const program = EnvironmentService.pipe(
			Effect.flatMap((service) => service.setVar("TEST_VAR", "test_value")),
			Effect.flatMap(() => EnvironmentService.pipe(Effect.flatMap((s) => s.getVar("TEST_VAR")))),
		);
		const result = await runPromise(program);
		expect(result).toBe("test_value");
	});

	it("should get existing environment variable", async () => {
		const program = EnvironmentService.pipe(Effect.flatMap((service) => service.getVar("PATH")));
		const result = await runPromise(program);
		expect(result).not.toBeNull();
	});

	it("should list environment variables", async () => {
		const program = EnvironmentService.pipe(
			Effect.flatMap((service) => service.setVar("TEST_VAR_2", "test")),
			Effect.flatMap(() => EnvironmentService.pipe(Effect.flatMap((s) => s.listVars()))),
		);
		const result = await runPromise(program);
		expect(result.length).toBeGreaterThan(0);
	});

	it("should expand variables in string", async () => {
		const program = EnvironmentService.pipe(
			Effect.flatMap((service) => service.setVar("NAME", "wshell")),
			Effect.flatMap(() => EnvironmentService.pipe(Effect.flatMap((s) => s.expandVars("Hello $NAME!")))),
		);
		const result = await runPromise(program);
		expect(result).toBe("Hello wshell!");
	});
});
