import { Effect } from "effect";

export const clearCommand = {
	name: "clear",
	description: "Clear the screen",
	execute: () =>
		Effect.sync(() => {
			process.stdout.write("\x1b[2J\x1b[0f");
		}),
};