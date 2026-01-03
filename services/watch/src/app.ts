import { Effect, Schedule, Stream } from "effect";
import { log, watch } from "./services";

const program = watch(".", { ignored: /node_modules/ }).pipe(
	Stream.groupedWithin(Infinity, 500),
	Stream.runForEach((events) => log(`Received events: ${JSON.stringify(events)}`)),
);

Effect.runPromise(program).catch(console.error);
