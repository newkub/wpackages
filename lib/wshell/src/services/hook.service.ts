import { HookError } from "../types/errors";
import { Hook, HookContext } from "../types/hook";
import { Command } from "../types/command";
import { Context, Effect, Layer } from "effect";

export class HookService extends Context.Tag("HookService")<
	HookService,
	{
		readonly registerHook: (hook: Hook) => Effect.Effect<void, HookError>;
		readonly unregisterHook: (name: string) => Effect.Effect<void, HookError>;
		readonly executeBeforeHooks: (command: Command) => Effect.Effect<Command, HookError>;
		readonly executeAfterHooks: (command: Command, result: unknown) => Effect.Effect<void, HookError>;
		readonly executeErrorHooks: (command: Command, error: unknown) => Effect.Effect<void, HookError>;
		readonly listHooks: () => Effect.Effect<Hook[], HookError>;
	}
>() {}

export const HookServiceLive = Layer.effect(
	HookService,
	Effect.sync(() => {
		const hooks: Record<string, Hook> = {};

		return HookService.of({
			registerHook: (hook) =>
				Effect.sync(() => {
					hooks[hook.name] = hook;
				}),

			unregisterHook: (name) =>
				Effect.sync(() => {
					delete hooks[name];
				}),

			executeBeforeHooks: (command) =>
				Effect.gen(function*() {
					let modifiedCommand = command;
					const beforeHooks = Object.values(hooks).filter((h) => h.type === "before");

					for (const hook of beforeHooks) {
						if (hook.command && hook.command !== command.name) continue;

						try {
							const context = HookContext.make({
								command,
								env: process.env,
							});
							const result = yield* Effect.tryPromise({
								try: () => Promise.resolve(eval(hook.handler)(context)),
								catch: (e) => new HookError({ message: `Hook ${hook.name} failed`, hookName: hook.name, cause: e }),
							});

							if (result && typeof result === "object" && "command" in result) {
								modifiedCommand = result.command as Command;
							}
						} catch (e) {
							yield* Effect.logError(`Hook ${hook.name} failed: ${String(e)}`);
						}
					}

					return modifiedCommand;
				}),

			executeAfterHooks: (command, result) =>
				Effect.gen(function*() {
					const afterHooks = Object.values(hooks).filter((h) => h.type === "after");

					for (const hook of afterHooks) {
						if (hook.command && hook.command !== command.name) continue;

						try {
							const context = HookContext.make({
								command,
								env: process.env,
							});
							// eslint-disable-next-line no-eval -- Intentional: Hooks need to execute dynamic code from plugins
							yield* Effect.tryPromise({
								try: () => Promise.resolve(eval(hook.handler)(context, result)),
								catch: (e) => new HookError({ message: `Hook ${hook.name} failed`, hookName: hook.name, cause: e }),
							});
						} catch (e) {
							yield* Effect.logError(`Hook ${hook.name} failed: ${String(e)}`);
						}
					}
				}),

			executeErrorHooks: (command, error) =>
				Effect.gen(function*() {
					const errorHooks = Object.values(hooks).filter((h) => h.type === "error");

					for (const hook of errorHooks) {
						if (hook.command && hook.command !== command.name) continue;

						try {
							const context = HookContext.make({
								command,
								env: process.env,
							});
							// eslint-disable-next-line no-eval -- Intentional: Hooks need to execute dynamic code from plugins
							yield* Effect.tryPromise({
								try: () => Promise.resolve(eval(hook.handler)(context, error)),
								catch: (e) => new HookError({ message: `Hook ${hook.name} failed`, hookName: hook.name, cause: e }),
							});
						} catch (e) {
							yield* Effect.logError(`Hook ${hook.name} failed: ${String(e)}`);
						}
					}
				}),

			listHooks: () =>
				Effect.sync(() => {
					return Object.values(hooks);
				}),
		});
	}),
);
