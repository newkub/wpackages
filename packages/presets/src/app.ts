import { Effect } from "effect";
import { log } from "./services";

const program = log("Hello, World!");

Effect.runSync(program);
