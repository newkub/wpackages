import { Effect, Layer } from "effect";
import { Button } from "./components";
import { ApiClient, ApiClientLive, Logger, LoggerLive } from "./services";
import { capitalize } from "./utils";

// The core application logic now accepts services as arguments
export const appLogic = ({ logger, apiClient }: { logger: Logger; apiClient: ApiClient }) =>
    logger.log("App started").pipe(
        Effect.flatMap(() => apiClient.getUsers),
        Effect.flatMap((users) => logger.log(`Fetched users: ${JSON.stringify(users)}`)),
        Effect.map(() => {
            const capitalizedLabel = capitalize("click me");
            return Button({ label: capitalizedLabel, onClick: logger.log("Button clicked!") });
        }),
        Effect.flatMap((button) => logger.log(`Rendering button: ${button}`))
    );

// The layer is defined here to be used at the entry point
export const MainLive = Layer.merge(LoggerLive, ApiClientLive);
