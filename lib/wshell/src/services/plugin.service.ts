import { PluginError } from "../types/errors";
import { Plugin } from "../types/plugin";
import { ConfigService } from "./config.service";
import { Context, Effect, Layer } from "effect";

export class PluginService extends Context.Tag("PluginService")<
	PluginService,
	{
		readonly loadPlugin: (name: string, path: string) => Effect.Effect<Plugin, PluginError>;
		readonly unloadPlugin: (name: string) => Effect.Effect<void, PluginError>;
		readonly listPlugins: () => Effect.Effect<Plugin[], PluginError>;
		readonly getPlugin: (name: string) => Effect.Effect<Plugin | null, PluginError>;
		readonly loadAllPlugins: () => Effect.Effect<void, PluginError>;
	}
>() {}

export const PluginServiceLive = Layer.effect(
	PluginService,
	Effect.gen(function*() {
		const configService = yield* ConfigService;
		const config = yield* configService.getConfig().pipe(
			Effect.mapError((e) => new PluginError({ message: `Failed to load config: ${e.message}`, pluginName: "system", cause: e })),
		);

		const plugins: Record<string, Plugin> = {};

		return PluginService.of({
			loadPlugin: (name, path) =>
				Effect.gen(function*() {
					const pluginModule = yield* Effect.tryPromise({
						try: () => import(path),
						catch: (e) => new PluginError({ message: `Failed to load plugin module from ${path}`, pluginName: name, cause: e }),
					});

					const pluginManifest = pluginModule.default ?? pluginModule.manifest;

					if (!pluginManifest) {
						return yield* new PluginError({ message: `Plugin ${name} has no manifest`, pluginName: name });
					}

					const plugin: Plugin = Plugin.make({
						name: pluginManifest.name ?? name,
						version: pluginManifest.version ?? "0.0.0",
						path,
						enabled: pluginManifest.enabled ?? true,
					});

					plugins[name] = plugin;

					if (pluginManifest.onLoad) {
						yield* Effect.tryPromise({
							try: () => Promise.resolve(pluginManifest.onLoad()),
							catch: (e) => new PluginError({ message: `Plugin ${name} onLoad failed`, pluginName: name, cause: e }),
						});
					}

					return plugin;
				}),

			unloadPlugin: (name) =>
				Effect.gen(function*() {
					const plugin = plugins[name];
					if (!plugin) {
						return yield* new PluginError({ message: `Plugin ${name} not found`, pluginName: name });
					}

					try {
						const pluginModule = yield* Effect.tryPromise({
							try: () => import(plugin.path),
							catch: (e) => new PluginError({ message: `Failed to import plugin ${name}`, pluginName: name, cause: e }),
						});

						const pluginManifest = pluginModule.default ?? pluginModule.manifest;
						if (pluginManifest?.onUnload) {
							yield* Effect.tryPromise({
								try: () => Promise.resolve(pluginManifest.onUnload()),
								catch: (e) => new PluginError({ message: `Plugin ${name} onUnload failed`, pluginName: name, cause: e }),
							});
						}

						delete plugins[name];
					} catch (e) {
						if (e instanceof PluginError) {
							throw e;
						}
						throw new PluginError({ message: `Failed to unload plugin ${name}`, pluginName: name, cause: e });
					}
				}),

			listPlugins: () =>
				Effect.sync(() => {
					return Object.values(plugins);
				}),

			getPlugin: (name) =>
				Effect.sync(() => {
					return plugins[name] ?? null;
				}),

			loadAllPlugins: () =>
				Effect.gen(function*() {
					const pluginPaths = config.plugins;

					for (const pluginPath of pluginPaths) {
						const pluginName = pluginPath.split("/").pop() ?? pluginPath;
						yield* PluginService.loadPlugin(pluginName, pluginPath);
					}
				}),
		});
	}),
);
