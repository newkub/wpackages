import { Effect } from "effect";
import { PluginError } from "../types/errors";
import { Plugin } from "../types/plugin";

export const loadPlugin = async (name: string, path: string): Promise<Plugin> => {
	try {
		const pluginModule = await import(path);
		const pluginManifest = pluginModule.default ?? pluginModule.manifest;

		if (!pluginManifest) {
			throw new PluginError({ message: `Plugin ${name} has no manifest`, pluginName: name });
		}

		const plugin = Plugin.make({
			name: pluginManifest.name ?? name,
			version: pluginManifest.version ?? "0.0.0",
			path,
			enabled: pluginManifest.enabled ?? true,
		});

		if (pluginManifest.onLoad) {
			await pluginManifest.onLoad();
		}

		return plugin;
	} catch (e) {
		if (e instanceof PluginError) {
			throw e;
		}
		throw new PluginError({ message: `Failed to load plugin ${name}`, pluginName: name, cause: e });
	}
};

export const unloadPlugin = async (plugin: Plugin): Promise<void> => {
	try {
		const pluginModule = await import(plugin.path);
		const pluginManifest = pluginModule.default ?? pluginModule.manifest;

		if (pluginManifest?.onUnload) {
			await pluginManifest.onUnload();
		}
	} catch (e) {
		throw new PluginError({ message: `Failed to unload plugin ${plugin.name}`, pluginName: plugin.name, cause: e });
	}
};

export const validatePlugin = (plugin: unknown): Effect.Effect<Plugin, PluginError> =>
	Effect.try({
		try: () => Plugin.make(plugin as any),
		catch: (e) => new PluginError({ message: "Invalid plugin schema", cause: e }),
	});
