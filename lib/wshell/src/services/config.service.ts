import { ConfigError } from "../types/errors";
import { ShellConfig } from "../types/config";
import { Context, Effect, Layer } from "effect";

export class ConfigService extends Context.Tag("ConfigService")<
	ConfigService,
	{
		readonly loadConfig: (path?: string) => Effect.Effect<ShellConfig, ConfigError>;
		readonly saveConfig: (config: ShellConfig, path?: string) => Effect.Effect<void, ConfigError>;
		readonly getConfig: () => Effect.Effect<ShellConfig, ConfigError>;
		readonly validateConfig: (config: unknown) => Effect.Effect<ShellConfig, ConfigError>;
	}
>() {}

export const ConfigServiceLive = Layer.effect(
	ConfigService,
	Effect.sync(() => {
		let currentConfig: ShellConfig | null = null;

		return ConfigService.of({
			loadConfig: (path) =>
				Effect.gen(function*() {
					const configPath = path ?? "~/.wshell/config.ts";
					try {
						const configModule = yield* Effect.tryPromise({
							try: () => import(configPath),
							catch: (e) => new ConfigError({ message: `Failed to load config from ${configPath}`, cause: e }),
						});
						const rawConfig = configModule.config ?? configModule.default;
						const validated = yield* Effect.try({
							try: () => ShellConfig.make(rawConfig as any),
							catch: (e) => new ConfigError({ message: `Invalid config schema`, cause: e }),
						});
						currentConfig = validated;
						return validated;
					} catch (e) {
						if (path === undefined) {
							currentConfig = ShellConfig.make({});
							return currentConfig;
						}
						throw e;
					}
				}),

			saveConfig: (_config, _path) =>
				Effect.gen(function*() {
					currentConfig = _config;
					return yield* Effect.succeed(undefined);
				}),

			getConfig: () =>
				Effect.sync(() => {
					if (currentConfig === null) {
						currentConfig = ShellConfig.make({});
					}
					return currentConfig;
				}),

			validateConfig: (config) =>
				Effect.try({
					try: () => ShellConfig.make(config as any),
					catch: (e) => new ConfigError({ message: "Invalid config schema", cause: e }),
				}),
		});
	}),
);
