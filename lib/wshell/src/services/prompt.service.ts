import { ConsoleService } from "@wpackages/console";
import { Context, Effect, Layer } from "effect";

export class PromptService extends Context.Tag("PromptService")<
	PromptService,
	{
		readonly renderPrompt: (cwd?: string) => Effect.Effect<void, never>;
		readonly renderContinuationPrompt: () => Effect.Effect<void, never>;
		readonly highlightInput: (input: string) => Effect.Effect<string, never>;
		readonly showSuggestions: (suggestions: string[]) => Effect.Effect<void, never>;
	}
>() {}

export const PromptServiceLive = Layer.effect(
	PromptService,
	Effect.gen(function*() {
		const console = yield* ConsoleService;

		return PromptService.of({
			renderPrompt: (cwd) =>
				Effect.sync(() => {
					const dir = cwd ?? process.cwd();
					const prompt = `${dir}> `;
					process.stdout.write(prompt);
				}),

			renderContinuationPrompt: () =>
				Effect.sync(() => {
					process.stdout.write("...> ");
				}),

			highlightInput: (input) =>
				Effect.sync(() => {
					return input;
				}),

			showSuggestions: (suggestions) =>
				Effect.sync(() => {
					if (suggestions.length === 0) return;
					console.log("\nSuggestions:");
					suggestions.forEach((s, i) => {
						console.log(`  ${i + 1}. ${s}`);
					});
				}),
		});
	}),
);
