import { ConsoleService } from "@wpackages/console";
import { EnvironmentService } from "../services/environment.service";
import { Effect } from "effect";

export const envCommand = {
	name: "env",
	description: "Manage environment variables",
	execute: (args: string[]) =>
		Effect.gen(function*() {
			const console = yield* ConsoleService;
			const envService = yield* EnvironmentService;

			if (args.length === 0) {
				const vars = yield* envService.listVars();
				if (vars.length === 0) {
					console.log("No custom environment variables defined");
				}
				console.log("Environment variables:");
				for (const [key, value] of Object.entries(process.env)) {
					console.log(`  ${key}=${value}`);
				}
				return;
			}

			if (args[0] === "-u" || args[0] === "--unset") {
				const name = args[1];
				if (!name) {
					console.log("Usage: env --unset <name>");
					return;
				}
				yield* envService.unsetVar(name);
				console.log(`Environment variable '${name}' unset`);
				return;
			}

			const name = args[0];
			const value = args.slice(1).join(" ");

			if (!value) {
				const varValue = yield* envService.getVar(name);
				if (varValue) {
					console.log(`${name}=${varValue}`);
				} else {
					console.log(`Environment variable '${name}' not found`);
				}
				return;
			}

			yield* envService.setVar(name, value);
			console.log(`Environment variable '${name}' set`);
		}),
};