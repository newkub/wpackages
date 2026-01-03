import { Effect } from "@wpackages/functional";
import { describe, expect, test } from "vitest";
import { CommandLive, run } from "./index";
import { CommandError } from "./error";

describe("@wts/command", () => {
	test("run should execute a command and return stdout", async () => {
		const program = run(process.execPath, ["-e", "process.stdout.write('ok')"]);
		const result = await Effect.runPromise(Effect.provideLayer(program, CommandLive));
		expect(result.stdout).toBe("ok");
	});

	test("run should fail with CommandError on non-zero exit code", async () => {
		const program = run(process.execPath, ["-e", "process.exit(1)"]);
		const result = await Effect.runPromiseEither(Effect.provideLayer(program, CommandLive));
		expect(result._tag).toBe("Left");
		if (result._tag !== "Left") {
			throw new Error("Expected Left");
		}
		expect(result.left).toBeInstanceOf(CommandError);
		expect(result.left.exitCode).toBe(1);
	});
});
