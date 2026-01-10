import { ConsoleService } from "@wpackages/console";
import { HistoryService } from "../services/history.service";
import { Effect } from "effect";

export const historyCommand = {
	name: "history",
	description: "Show command history",
	execute: (args: string[]) =>
		Effect.gen(function*() {
			const console = yield* ConsoleService;
			const historyService = yield* HistoryService;

			if (args.length > 0 && args[0] === "clear") {
				yield* historyService.clear();
				console.log("History cleared");
				return;
			}

			if (args.length > 0 && args[0] === "search") {
				const query = args.slice(1).join(" ");
				if (!query) {
					console.log("Usage: history search <query>");
					return;
				}
				const results = yield* historyService.search(query);
				console.log(`Search results for "${query}":`);
				results.forEach((entry) => {
					console.log(`  ${entry.index}: ${entry.command}`);
				});
				return;
			}

			const history = yield* historyService.getAll();
			console.log("Command history:");
			history.forEach((entry) => {
				console.log(`  ${entry.index}: ${entry.command}`);
			});
		}),
};