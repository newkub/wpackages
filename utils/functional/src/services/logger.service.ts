import { Effect, Layer } from "effect";
import { Logger } from "./Logger";

export const LoggerLive = Layer.succeed(
    Logger,
    {
        log: (message: string) => Effect.sync(() => console.log(message))
    }
);
