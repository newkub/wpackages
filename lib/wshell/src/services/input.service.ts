import { Context, Effect, Layer } from "effect";

export class InputService extends Context.Tag("InputService")<
	InputService,
	{
		readonly readLine: () => Effect.Effect<string, never>;
		readonly readMultiLine: () => Effect.Effect<string, never>;
		readonly handleKeypress: () => Effect.Effect<void, never>;
		readonly handleTab: (currentInput: string) => Effect.Effect<string[], never>;
		readonly handleArrowKeys: (direction: "up" | "down", history: string[]) => Effect.Effect<string, never>;
	}
>() {}

export const InputServiceLive = Layer.effect(
	InputService,
	Effect.sync(() => {
		return InputService.of({
			readLine: () =>
				Effect.tryPromise({
					try: async () => {
						const readline = await import("node:readline");
						const rl = readline.createInterface({
							input: process.stdin,
							output: process.stdout,
						});
						return new Promise<string>((resolve) => {
							rl.question("", (answer) => {
								rl.close();
								resolve(answer);
							});
						});
					},
					catch: () => "",
				}),

			readMultiLine: () =>
				Effect.tryPromise({
					try: async () => {
						const readline = await import("node:readline");
						const rl = readline.createInterface({
							input: process.stdin,
							output: process.stdout,
						});
						const lines: string[] = [];
						return new Promise<string>((resolve) => {
							const askLine = () => {
								rl.question("", (answer) => {
									if (answer === "") {
										rl.close();
										resolve(lines.join("\n"));
									} else {
										lines.push(answer);
										askLine();
									}
								});
							};
							askLine();
						});
					},
					catch: () => "",
				}),

			handleKeypress: () => Effect.succeed(undefined),

			handleTab: () => Effect.succeed([]),

			handleArrowKeys: () => Effect.succeed(""),
		});
	}),
);
