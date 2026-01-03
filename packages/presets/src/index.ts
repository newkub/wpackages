import { Effect } from "effect";
import { Logger, LoggerLive } from "./services";

/**
 * Creates and runs an Effect program, providing it with the necessary services.
 * @param program The Effect program to run. It must require a Logger service.
 */
export const createApp = <A, E>(program: Effect.Effect<A, E, Logger>) => {
	const runnable = Effect.provide(program, LoggerLive);
	return Effect.runPromise(runnable);
};
