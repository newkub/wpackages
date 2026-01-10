import { HistoryError } from "../types/errors";
import { HistoryEntry } from "../types/history";
import { ConfigService } from "./config.service";
import { Context, Effect, Layer, Array as EArray } from "effect";

export class HistoryService extends Context.Tag("HistoryService")<
	HistoryService,
	{
		readonly addEntry: (command: string) => Effect.Effect<void, HistoryError>;
		readonly getPrevious: (currentIndex: number) => Effect.Effect<string | null, HistoryError>;
		readonly getNext: (currentIndex: number) => Effect.Effect<string | null, HistoryError>;
		readonly search: (query: string) => Effect.Effect<HistoryEntry[], HistoryError>;
		readonly saveToFile: () => Effect.Effect<void, HistoryError>;
		readonly loadFromFile: () => Effect.Effect<void, HistoryError>;
		readonly clear: () => Effect.Effect<void, HistoryError>;
		readonly getAll: () => Effect.Effect<HistoryEntry[], HistoryError>;
	}
>() {}

export const HistoryServiceLive = Layer.effect(
	HistoryService,
	Effect.gen(function*() {
		const configService = yield* ConfigService;
		const config = yield* configService.getConfig();
		let history: HistoryEntry[] = [];

		return HistoryService.of({
			addEntry: (command) =>
				Effect.sync(() => {
					if (command.trim() === "") return;

					const entry = HistoryEntry.make({
						command,
						timestamp: Date.now(),
						index: history.length,
					});

					history.push(entry);

					if (history.length > config.historySize) {
						history = EArray.dropLeft(history, history.length - config.historySize);
					}
				}),

			getPrevious: (idx) =>
				Effect.sync(() => {
					if (history.length === 0) return null;
					const newIndex = idx - 1;
					if (newIndex < 0) return null;
					return history[newIndex].command;
				}),

			getNext: (idx) =>
				Effect.sync(() => {
					if (history.length === 0) return null;
					const newIndex = idx + 1;
					if (newIndex >= history.length) return null;
					return history[newIndex].command;
				}),

			search: (query) =>
				Effect.sync(() => {
					const lowerQuery = query.toLowerCase();
					return history.filter((entry) => entry.command.toLowerCase().includes(lowerQuery));
				}),

			saveToFile: () =>
				Effect.tryPromise({
					try: async () => {
						const fs = await import("node:fs/promises");
						const path = await import("node:path");
						const homeDir = process.env.HOME ?? process.env.USERPROFILE ?? ".";
						const historyPath = path.join(homeDir, ".wshell_history");
						const content = history.map((entry) => entry.command).join("\n");
						await fs.writeFile(historyPath, content, "utf-8");
					},
					catch: (e) => new HistoryError({ message: "Failed to save history", cause: e }),
				}),

			loadFromFile: () =>
				Effect.tryPromise({
					try: async () => {
						const fs = await import("node:fs/promises");
						const path = await import("node:path");
						const homeDir = process.env.HOME ?? process.env.USERPROFILE ?? ".";
						const historyPath = path.join(homeDir, ".wshell_history");

						try {
							const content = await fs.readFile(historyPath, "utf-8");
							const lines = content.split("\n").filter((line) => line.trim() !== "");
							history = lines.map((line, index) =>
								HistoryEntry.make({
									command: line,
									timestamp: Date.now(),
									index,
								}),
							);
						} catch {
							history = [];
						}
					},
					catch: (e) => new HistoryError({ message: "Failed to load history", cause: e }),
				}),

			clear: () =>
				Effect.sync(() => {
					history = [];
				}),

			getAll: () => Effect.sync(() => history),
		});
	}),
);
