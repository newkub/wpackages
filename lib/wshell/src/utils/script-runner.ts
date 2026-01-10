import { ScriptError } from "../types/errors";
import { Script } from "../types/script";
import { ParserService } from "../services/parser.service";
import { ExecutorService } from "../services/executor.service";
import { Effect } from "effect";

export const runScript = async (script: Script): Promise<void> => {
	try {
		const lines = script.content
			.split("\n")
			.filter((line) => line.trim() !== "" && !line.trim().startsWith("#"));

		for (const line of lines) {
			const command = await Effect.runPromise(ParserService.pipe(Effect.flatMap((p) => p.parse(line))));
			await Effect.runPromise(ExecutorService.pipe(Effect.flatMap((e) => e.execute(command))));
		}
	} catch (e) {
		if (e instanceof ScriptError) {
			throw e;
		}
		throw new ScriptError({ message: "Failed to run script", scriptPath: script.path, cause: e });
	}
};

export const parseScriptFile = async (path: string, args: string[] = []): Promise<Script> => {
	try {
		const fs = await import("node:fs/promises");
		const content = await fs.readFile(path, "utf-8");

		return Script.make({
			path,
			content,
			args,
		});
	} catch (e) {
		throw new ScriptError({ message: `Failed to parse script file: ${path}`, scriptPath: path, cause: e });
	}
};

export const validateScriptSyntax = (content: string): Effect.Effect<boolean, ScriptError> =>
	Effect.gen(function*() {
		const lines = content.split("\n").filter((line) => line.trim() !== "" && !line.trim().startsWith("#"));

		for (const line of lines) {
			yield* Effect.try({
				try: () => ParserService.pipe(Effect.flatMap((p) => p.parse(line))),
				catch: (e) => new ScriptError({ message: `Invalid syntax: ${line}`, cause: e }),
			});
		}

		return true;
	});
