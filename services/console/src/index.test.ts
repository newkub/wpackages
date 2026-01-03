import { Console, Effect, Layer } from "effect";
import { describe, expect, it } from "vitest";
import { JsonLoggerLive, PrettyLoggerLive } from ".";

// Mock Console Service to capture output
const makeTestConsole = (messages: string[]) =>
	Console.make({
		log: (...args) => Effect.sync(() => messages.push(args.join(" "))),
		error: (...args) => Effect.sync(() => messages.push(args.join(" "))),
		warn: (...args) => Effect.sync(() => messages.push(args.join(" "))),
		info: (...args) => Effect.sync(() => messages.push(args.join(" "))),
		debug: (...args) => Effect.sync(() => messages.push(args.join(" "))),
	});

describe("Logger Layers", () => {
	it("PrettyLoggerLive should be configurable and filter logs below minLevel", async () => {
		const messages: string[] = [];
		const TestConsoleLive = Layer.succeed(Console.Console, makeTestConsole(messages));

		const program = Effect.gen(function*($) {
			yield* $(Effect.logDebug("this is a debug message"));
			yield* $(Effect.logInfo("this is an info message"));
		});

		const loggerLayer = PrettyLoggerLive({ minLevel: "Info" });

		const runnable = program.pipe(Effect.provide(loggerLayer.pipe(Layer.provide(TestConsoleLive))));

		await Effect.runPromise(runnable);

		expect(messages.some((m) => m.includes("this is a debug message"))).toBe(false);
		expect(messages.some((m) => m.includes("this is an info message"))).toBe(true);
	});

	it("JsonLoggerLive should output logs in JSON format", async () => {
		const messages: string[] = [];
		const TestConsoleLive = Layer.succeed(Console.Console, makeTestConsole(messages));

		const program = Effect.logWarning("this is a warning");

		const runnable = program.pipe(Effect.provide(JsonLoggerLive.pipe(Layer.provide(TestConsoleLive))));

		await Effect.runPromise(runnable);

		expect(messages.length).toBe(1);
		const log = JSON.parse(messages[0]);
		expect(log.message).toBe("this is a warning");
		expect(log.logLevel).toBe("Warning");
	});
});
