import { all as allBuiltins, CommandServiceLive } from "@wpackages/command";
import { ConsoleServiceLive } from "@wpackages/console";
import { Effect, Layer } from "effect";
import { main } from "./app";
import { DisplayServiceLive } from "./services/display.service";
import { ExecutorServiceLive } from "./services/executor.service";
import { ParserServiceLive } from "./services/parser.service";

// Create a layer for the CommandService with all built-in commands.
const CommandLive = CommandServiceLive(allBuiltins);

// Compose all the service layers together.
const DisplayLive = Layer.provide(
	DisplayServiceLive,
	ConsoleServiceLive,
);

const ServicesLive = Layer.provide(
	ExecutorServiceLive,
	Layer.mergeAll(CommandLive, DisplayLive),
);

const AppLive = Layer.mergeAll(
	ServicesLive,
	ConsoleServiceLive,
	ParserServiceLive,
	CommandLive,
	DisplayLive,
);

const runnable = main.pipe(Effect.provide(AppLive));

Effect.runPromise(runnable).catch((e) => {
	console.error("An unhandled error occurred:", e);
	process.exit(1);
});
