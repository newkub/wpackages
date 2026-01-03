import { Layer } from "../lib/functional";
import { Config } from "./app.config";

// Create a mock implementation for the Config service for testing purposes
export const TestConfigLive = Layer.succeed(Config, {
    logLevel: "info",
});
