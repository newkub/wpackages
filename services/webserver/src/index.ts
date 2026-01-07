import "dotenv/config";
import { BunRuntime } from "@effect/platform-bun";
import { ConsoleSpanExporter, init, SimpleSpanProcessor } from "@wpackages/tracing";
import { Effect, Fiber, Layer } from "effect";
import { main } from "./app";
import { ConfigLive, ConfigLiveLayer } from "./config";

const AppLayer = Layer.provide(main, ConfigLiveLayer);

const program = Effect.gen(function*() {
	const enableTracing = yield* Effect.map(ConfigLive, (config) => config.ENABLE_TRACING);
	if (enableTracing) {
		void init({
			spanProcessor: new SimpleSpanProcessor(new ConsoleSpanExporter()),
		});
	}

	const fiber = yield* Effect.fork(Layer.launch(AppLayer));

	yield* Effect.sync(() => {
		if (typeof process?.on !== "function") return;

		const shutdown = () => {
			Fiber.interrupt(fiber).pipe(Effect.runFork);
		};

		process.on("SIGINT", shutdown);
		process.on("SIGTERM", shutdown);
	});

	yield* Fiber.join(fiber);
});

BunRuntime.runMain(program);
