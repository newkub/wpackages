import type {
	Plugin,
	PluginEventEmitter,
	PluginManagerConfig,
	PluginRegistry,
	PluginState,
} from "../../types";
import { buildDependencyGraph, detectCircularDependencies } from "../../utils";
import type { PluginResult } from "../plugin-manager.service";
import { createPluginAPI } from "./api";

// This file contains the core lifecycle logic for plugins.
// It is designed to be used within the createPluginManager factory.

export const installPlugin = async (
	plugin: Plugin,
	registry: PluginRegistry,
	config: PluginManagerConfig,
	eventEmitter: PluginEventEmitter,
	logger: PluginManagerConfig["logger"],
): Promise<{ registry: PluginRegistry; result: PluginResult }> => {
	const id = plugin.metadata.id;
	if (registry[id]) {
		throw new Error(`Plugin ${id} is already installed`);
	}

	const maxPlugins = config.maxPlugins ?? 100;
	if (Object.keys(registry).length >= maxPlugins) {
		throw new Error(`Maximum number of plugins (${maxPlugins}) reached`);
	}

	// Check circular dependencies
	const allPlugins = [...Object.values(registry).map((s) => s.plugin), plugin];
	const graph = buildDependencyGraph(allPlugins);
	const cycles = detectCircularDependencies(graph);

	if (cycles.length > 0) {
		const cycle = Array.isArray(cycles[0]) ? cycles[0].join(" -> ") : String(cycles[0]);
		throw new Error(`Circular dependency detected: ${cycle}`);
	}

	try {
		logger?.info("Installing plugin", {
			pluginId: id,
			version: plugin.metadata.version,
		});

		if (plugin.hooks?.onInstall) {
			await plugin.hooks.onInstall();
		}

		const state: PluginState = {
			installedAt: new Date(),
			plugin,
			status: "installed",
		};

		const newRegistry = { ...registry, [id]: state };

		await eventEmitter.emit({
			pluginId: id,
			timestamp: new Date(),
			type: "plugin:installed",
		});

		logger?.info("Plugin installed successfully", { pluginId: id });

		return { registry: newRegistry, result: { _tag: "Success", value: undefined } };
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : String(error);
		logger?.error("Failed to install plugin", error, { pluginId: id });

		await eventEmitter.emit({
			data: error,
			pluginId: id,
			timestamp: new Date(),
			type: "plugin:error",
		});
		return { registry, result: { _tag: "Failure", error: errorMsg } };
	}
};

export const uninstallPlugin = async (
	pluginId: string,
	registry: PluginRegistry,
	eventEmitter: PluginEventEmitter,
): Promise<{ registry: PluginRegistry; result: PluginResult }> => {
	const state = registry[pluginId];
	if (!state) {
		return { registry, result: { _tag: "Failure", error: `Plugin ${pluginId} is not installed` } };
	}

	try {
		if (state.plugin.hooks?.onUninstall) {
			await state.plugin.hooks.onUninstall();
		}

		const { [pluginId]: _, ...rest } = registry;
		
		await eventEmitter.emit({
			pluginId,
			timestamp: new Date(),
			type: "plugin:uninstalled",
		});

		return { registry: rest, result: { _tag: "Success", value: undefined } };
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : String(error);
		await eventEmitter.emit({
			data: error,
			pluginId,
			timestamp: new Date(),
			type: "plugin:error",
		});
		return { registry, result: { _tag: "Failure", error: errorMsg } };
	}
};

export const enablePlugin = async (
	pluginId: string,
	registry: PluginRegistry,
	eventEmitter: PluginEventEmitter,
	apiHandlers: Map<string, unknown>,
	logger: PluginManagerConfig["logger"],
): Promise<{ registry: PluginRegistry; result: PluginResult }> => {
	const state = registry[pluginId];
	if (!state) {
		return { registry, result: { _tag: "Failure", error: `Plugin ${pluginId} is not installed` } };
	}

	if (state.status === "enabled") {
		return { registry, result: { _tag: "Success", value: undefined } };
	}

	try {
		logger?.info("Enabling plugin", { pluginId });

		const api = createPluginAPI(pluginId, eventEmitter, apiHandlers);
		await state.plugin.init(api);

		if (state.plugin.hooks?.onEnable) {
			await state.plugin.hooks.onEnable();
		}

		const newRegistry = {
			...registry,
			[pluginId]: {
				...state,
				enabledAt: new Date(),
				status: "enabled",
			},
		};

		await eventEmitter.emit({
			pluginId,
			timestamp: new Date(),
			type: "plugin:enabled",
		});

		logger?.info("Plugin enabled successfully", { pluginId });
		return { registry: newRegistry, result: { _tag: "Success", value: undefined } };
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : String(error);
		logger?.error("Failed to enable plugin", error, { pluginId });

		const newRegistry = {
			...registry,
			[pluginId]: {
				...state,
				error: error instanceof Error ? error : new Error(String(error)),
				status: "error",
			},
		};

		await eventEmitter.emit({
			data: error,
			pluginId,
			timestamp: new Date(),
			type: "plugin:error",
		});
		return { registry: newRegistry, result: { _tag: "Failure", error: errorMsg } };
	}
};

export const disablePlugin = async (
	pluginId: string,
	registry: PluginRegistry,
	eventEmitter: PluginEventEmitter,
): Promise<{ registry: PluginRegistry; result: PluginResult }> => {
	const state = registry[pluginId];
	if (!state) {
		return { registry, result: { _tag: "Failure", error: `Plugin ${pluginId} is not installed` } };
	}

	if (state.status !== "enabled") {
		return { registry, result: { _tag: "Success", value: undefined } };
	}

	try {
		if (state.plugin.hooks?.onDisable) {
			await state.plugin.hooks.onDisable();
		}

		const newRegistry = {
			...registry,
			[pluginId]: {
				...state,
				status: "disabled",
			},
		};

		await eventEmitter.emit({
			pluginId,
			timestamp: new Date(),
			type: "plugin:disabled",
		});

		return { registry: newRegistry, result: { _tag: "Success", value: undefined } };
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : String(error);
		await eventEmitter.emit({
			data: error,
			pluginId,
			timestamp: new Date(),
			type: "plugin:error",
		});
		return { registry, result: { _tag: "Failure", error: errorMsg } };
	}
};

export const updatePlugin = async (
	pluginId: string,
	newPlugin: Plugin,
	registry: PluginRegistry,
	eventEmitter: PluginEventEmitter,
	logger: PluginManagerConfig["logger"],
	disableFn: (pluginId: string) => Promise<{ registry: PluginRegistry; result: PluginResult }>,
	enableFn: (pluginId: string) => Promise<{ registry: PluginRegistry; result: PluginResult }>,
): Promise<{ registry: PluginRegistry; result: PluginResult }> => {
	const state = registry[pluginId];
	if (!state) {
		return { registry, result: { _tag: "Failure", error: `Plugin ${pluginId} is not installed` } };
	}

	const oldVersion = state.plugin.metadata.version;
	const newVersion = newPlugin.metadata.version;

	if (oldVersion === newVersion) {
		return { registry, result: { _tag: "Failure", error: `Plugin ${pluginId} is already at version ${newVersion}` } };
	}

	const wasEnabled = state.status === "enabled";
	let currentRegistry = registry;

	// Disable if enabled
	if (wasEnabled) {
		const disableResult = await disableFn(pluginId);
		currentRegistry = disableResult.registry;
		if (disableResult.result._tag === "Failure") {
			return { registry: currentRegistry, result: disableResult.result };
		}
	}

	try {
		logger?.info("Updating plugin", {
			pluginId,
			oldVersion,
			newVersion,
		});

		// Call onUpdate hook if exists
		if (newPlugin.hooks?.onUpdate) {
			await newPlugin.hooks.onUpdate(oldVersion);
		}

		// Update registry
		currentRegistry = {
			...currentRegistry,
			[pluginId]: {
				...state,
				plugin: newPlugin,
			},
		};

		await eventEmitter.emit({
			data: { oldVersion, newVersion },
			pluginId,
			timestamp: new Date(),
			type: "plugin:updated" as const,
		});

		logger?.info("Plugin updated successfully", {
			pluginId,
			newVersion,
		});

		// Re-enable if was enabled
		if (wasEnabled) {
			const enableResult = await enableFn(pluginId);
			currentRegistry = enableResult.registry;
			if (enableResult.result._tag === "Failure") {
				return { registry: currentRegistry, result: enableResult.result };
			}
		}

		return { registry: currentRegistry, result: { _tag: "Success", value: undefined } };
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : String(error);
		logger?.error("Failed to update plugin", error, { pluginId });
		return { registry, result: { _tag: "Failure", error: errorMsg } };
	}
};
