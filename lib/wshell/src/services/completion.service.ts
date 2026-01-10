import { CompletionError } from "../types/errors";
import { CompletionItem } from "../types/completion";
import { Context, Effect, Layer } from "effect";

export class CompletionService extends Context.Tag("CompletionService")<
	CompletionService,
	{
		readonly completeCommand: (input: string) => Effect.Effect<CompletionItem[], CompletionError>;
		readonly completeArgument: (command: string, input: string) => Effect.Effect<CompletionItem[], CompletionError>;
		readonly completeFilePath: (input: string) => Effect.Effect<CompletionItem[], CompletionError>;
		readonly completeEnvVar: (input: string) => Effect.Effect<CompletionItem[], CompletionError>;
		readonly getSuggestions: (input: string) => Effect.Effect<CompletionItem[], CompletionError>;
		readonly filterSuggestions: (suggestions: CompletionItem[], input: string) => Effect.Effect<CompletionItem[], CompletionError>;
	}
>() {}

export const CompletionServiceLive = Layer.effect(
	CompletionService,
	Effect.sync(() => {
		const builtinCommands = ["ls", "cd", "pwd", "echo", "cat", "help", "history", "alias", "env", "clear", "exit"];

		return CompletionService.of({
			completeCommand: (input) =>
				Effect.sync(() => {
					const matches = builtinCommands.filter((cmd) => cmd.startsWith(input));
					return matches.map((cmd) =>
						CompletionItem.make({
							label: cmd,
							type: "command",
							description: `Built-in command: ${cmd}`,
							value: cmd,
						}),
					);
				}),

			completeArgument: () => Effect.succeed([]),

			completeFilePath: () =>
				Effect.tryPromise({
					try: async () => {
						const fs = await import("node:fs/promises");
						const path = await import("node:path");
						const dir = path.dirname(input) || ".";
						const prefix = path.basename(input);

						try {
							const entries = await fs.readdir(dir, { withFileTypes: true });
							const matches = entries.filter((entry) => entry.name.startsWith(prefix));
							return matches.map((entry) =>
								CompletionItem.make({
									label: entry.name,
									type: "file",
									description: entry.isDirectory() ? "Directory" : "File",
									value: entry.name,
								}),
							);
						} catch {
							return [];
						}
					},
					catch: (e) => new CompletionError({ message: "Failed to complete file path", cause: e }),
				}),

			completeEnvVar: (input) =>
				Effect.sync(() => {
					const prefix = input.replace("$", "");
					const matches = Object.keys(process.env).filter((key) => key.startsWith(prefix));
					return matches.map((key) =>
						CompletionItem.make({
							label: `$${key}`,
							type: "env",
							description: `Environment variable: ${key}`,
							value: `$${key}`,
						}),
					);
				}),

			getSuggestions: (input) =>
				Effect.gen(function*() {
					if (input.startsWith("$")) {
						return yield* CompletionService.completeEnvVar(input);
					}
					if (input.includes("/")) {
						return yield* CompletionService.completeFilePath(input);
					}
					return yield* CompletionService.completeCommand(input);
				}),

			filterSuggestions: (suggestions, input) =>
				Effect.sync(() => {
					return suggestions.filter((item) => item.label.toLowerCase().includes(input.toLowerCase()));
				}),
		});
	}),
);
