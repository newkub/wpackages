import { Hook } from "../types/hook";
import { Command } from "../types/command";
import { HookContext } from "../types/hook";
import { Effect } from "effect";

export const createMiddleware = (hooks: Hook[]) => {
	return (command: Command): Effect.Effect<Command, never> =>
		Effect.gen(function*() {
			let modifiedCommand = command;
			const beforeHooks = hooks.filter((h) => h.type === "before");

			for (const hook of beforeHooks) {
				if (hook.command && hook.command !== command.name) continue;

				try {
					const context = HookContext.make({
						command,
						env: process.env,
					});

					const result = yield* Effect.tryPromise({
						try: async () => {
							if (typeof hook.handler === "function") {
								return await hook.handler(context);
							}
							return modifiedCommand;
						},
						catch: () => modifiedCommand,
					});

					if (result && typeof result === "object" && "command" in result) {
						modifiedCommand = result.command as Command;
					}
				} catch {
					continue;
				}
			}

			return modifiedCommand;
		});
};

export const applyMiddleware = (command: Command, hooks: Hook[]): Effect.Effect<Command, never> => {
	const middleware = createMiddleware(hooks);
	return middleware(command);
};
