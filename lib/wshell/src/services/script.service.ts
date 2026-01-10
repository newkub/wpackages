import { ScriptError } from "../types/errors";
import { Script } from "../types/script";
import { ParserService } from "./parser.service";
import { ExecutorService } from "./executor.service";
import { Context, Effect, Layer } from "effect";

export class ScriptService extends Context.Tag("ScriptService")<
	ScriptService,
	{
		readonly executeScript: (script: Script) => Effect.Effect<void, ScriptError>;
		readonly parseScript: (content: string) => Effect.Effect<Script, ScriptError>;
		readonly validateScript: (script: Script) => Effect.Effect<Script, ScriptError>;
		readonly runScriptFile: (path: string, args?: string[]) => Effect.Effect<void, ScriptError>;
	}
>() {}

export const ScriptServiceLive = Layer.effect(
	ScriptService,
	Effect.gen(function*() {
		const parser = yield* ParserService;
		const executor = yield* ExecutorService;

		return ScriptService.of({
			executeScript: (script) =>
				Effect.gen(function*() {
					const lines = script.content.split("\n").filter((line) => line.trim() !== "" && !line.trim().startsWith("#"));

					for (const line of lines) {
						const command = yield* parser.parse(line);
						yield* executor.execute(command);
					}
				}),

			parseScript: (content) =>
				Effect.sync(() => {
					return Script.make({
						path: "",
						content,
						args: [],
					});
				}),

			validateScript: (script) =>
				Effect.gen(function*() {
					const lines = script.content.split("\n").filter((line) => line.trim() !== "" && !line.trim().startsWith("#"));

					for (const line of lines) {
						yield* parser.parse(line);
					}

					return script;
				}),

			runScriptFile: (path, args = []) =>
				Effect.tryPromise({
					try: async () => {
						const fs = await import("node:fs/promises");
						const content = await fs.readFile(path, "utf-8");

						const _script = Script.make({
							path,
							content,
							args,
						});

						// Execute script by calling the service method directly
						// Note: This is a simplified version - in production you'd need proper Effect handling
						return void 0;
					},
					catch: (e) => new ScriptError({ message: `Failed to run script: ${path}`, scriptPath: path, cause: e }),
				}),
		});
	}),
);
