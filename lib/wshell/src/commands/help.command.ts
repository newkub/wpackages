import { CommandService } from "@wpackages/command";
import { ConsoleService } from "@wpackages/console";
import { Effect } from "effect";

export const helpCommand = {
	name: "help",
	description: "Show help information",
	execute: (args: string[]) =>
		Effect.gen(function*() {
			const console = yield* ConsoleService;
			const commandService = yield* CommandService;

			if (args.length > 0) {
				const commandName = args[0];
				const command = yield* commandService.lookup({ name: commandName, args: [] });
				console.log(`Command: ${commandName}`);
				console.log(`Description: ${command.description || "No description available"}`);
				return;
			}

			console.log("wshell - A type-safe shell powered by Effect-TS");
			console.log("");
			console.log("Built-in commands:");
			console.log("  help [command]    - Show help for a command");
			console.log("  history            - Show command history");
			console.log("  alias [name] [cmd] - Manage aliases");
			console.log("  env [name] [value] - Manage environment variables");
			console.log("  clear              - Clear the screen");
			console.log("  exit               - Exit the shell");
			console.log("");
			console.log("Use 'help <command>' for more information about a specific command.");
		}),
};