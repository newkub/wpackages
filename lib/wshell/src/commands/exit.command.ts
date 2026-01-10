import { ConsoleService } from "@wpackages/console";
import { Effect } from "effect";

export const exitCommand = {
	name: "exit",
	description: "Exit the shell",
	execute: () =>
		Effect.gen(function*() {
			const console = yield* ConsoleService;
			console.log("Goodbye!");
			process.exit(0);
		}),
};