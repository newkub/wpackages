import { Effect, Layer, Scope } from "effect";
import { appLogic, MainLive } from "./app";

// The main entry point for the application
const main = Effect.gen(function*(_) {
    // Build the layer to get the services
    const scope = yield* _(Scope.make());
    const services = yield* _(Layer.build(MainLive).pipe(Scope.extend(scope)));

    // Run the application logic with the services
    yield* _(appLogic(services));

    // Release the scope
    yield* _(Scope.close(scope, { exit: { _tag: "Success", value: undefined } }));
});

Effect.runPromise(main).then(() => {
    console.log("Application finished successfully.");
}).catch((error) => {
    console.error("Application failed:", error);
});
