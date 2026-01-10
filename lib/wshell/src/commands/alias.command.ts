import { ConsoleService } from "@wpackages/console";
import { AliasService } from "../services/alias.service";
import { Effect } from "effect";

export const aliasCommand = {
	name: "alias",
	description: "Manage aliases",
	execute: (args: string[]) =>
		Effect.gen(function*() {
			const console = yield* ConsoleService;
			const aliasService = yield* AliasService;

			if (args.length === 0) {
				const aliases = yield* aliasService.listAliases();
				if (aliases.length === 0) {
					console.log("No aliases defined");
					return;
				}
				console.log("Aliases:");
				aliases.forEach((alias) => {
					console.log(`  ${alias.name}='${alias.command}'${alias.description ? ` # ${alias.description}` : ""}`);
				});
				return;
			}

			if (args[0] === "-d" || args[0] === "--delete") {
				const name = args[1];
				if (!name) {
					console.log("Usage: alias --delete <name>");
					return;
				}
				yield* aliasService.removeAlias(name);
				console.log(`Alias '${name}' removed`);
				return;
			}

			const name = args[0];
			const command = args.slice(1).join(" ");

			if (!command) {
				const alias = yield* aliasService.getAlias(name);
				if (alias) {
					console.log(`${alias.name}='${alias.command}'${alias.description ? ` # ${alias.description}` : ""}`);
				} else {
					console.log(`Alias '${name}' not found`);
				}
				return;
			}

			yield* aliasService.addAlias(name, command);
			yield* aliasService.saveAliases();
			console.log(`Alias '${name}' added`);
		}),
};