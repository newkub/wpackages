import "dotenv/config";
import { BunRuntime } from "@effect/platform-bun";
import { main } from "./app";

BunRuntime.runMain(main);
