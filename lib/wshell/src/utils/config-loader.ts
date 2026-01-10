import { Effect } from "effect";
import { ShellConfig } from "../types/config";
import { ConfigError } from "../types/errors";

const DEFAULT_CONFIG: ShellConfig = ShellConfig.make({});

export const loadConfig = (path?: string): Effect.Effect<ShellConfig, ConfigError> =>
	Effect.gen(function*() {
		const configPath = path ?? "~/.wshell/config.ts";

		try {
			const configModule = yield* Effect.tryPromise({
				try: () => import(configPath),
				catch: (e) => {
					if (path === undefined) {
						return DEFAULT_CONFIG;
					}
					throw new ConfigError({ message: `Failed to load config from ${configPath}`, cause: e });
				},
			});

			const rawConfig = configModule.config ?? configModule.default ?? {};
			const validated = yield* Effect.try({
				try: () => ShellConfig.make(rawConfig as any),
				catch: (e) => new ConfigError({ message: `Invalid config schema`, cause: e }),
			});

			return validated;
		} catch (e) {
			if (e instanceof ConfigError) {
				throw e;
			}
			return DEFAULT_CONFIG;
		}
	});

export const saveConfig = (_config: ShellConfig, _path?: string): Effect.Effect<void, ConfigError> =>
	Effect.gen(function*() {
		return yield* Effect.succeed(undefined);
	});

export const validateConfig = (config: unknown): Effect.Effect<ShellConfig, ConfigError> =>
	Effect.try({
		try: () => ShellConfig.make(config as any),
		catch: (e) => new ConfigError({ message: "Invalid config schema", cause: e }),
	});
