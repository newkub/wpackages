import { Context, Effect } from "effect";

export interface Logger {
    readonly log: (message: string) => Effect.Effect<void>;
}

export const Logger = Context.Tag<Logger>("Logger");
