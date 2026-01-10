import { Context, Effect, Layer, Schema } from "effect";

export class PluginError extends Schema.TaggedError<PluginError>()(
	"PluginError",
	{
		message: Schema.String,
		pluginName: Schema.String,
	},
) {}

export interface PluginContext {
	app: unknown;
	config: Record<string, unknown>;
}

export interface PluginHook {
	beforeRequest?: (context: PluginContext) => Effect.Effect<void, PluginError>;
	afterRequest?: (context: PluginContext) => Effect.Effect<void, PluginError>;
	onError?: (context: PluginContext, error: unknown) => Effect.Effect<void, PluginError>;
}

export interface Plugin {
	name: string;
	version: string;
	hooks: PluginHook;
	register?: (context: PluginContext) => Effect.Effect<void, PluginError>;
	unregister?: (context: PluginContext) => Effect.Effect<void, PluginError>;
}

export class PluginManager extends Context.Tag("PluginManager")<PluginManager, {
	readonly register: (plugin: Plugin) => Effect.Effect<void, PluginError>;
	readonly unregister: (pluginName: string) => Effect.Effect<void, PluginError>;
	readonly getPlugin: (name: string) => Plugin | undefined;
	readonly getAllPlugins: () => readonly Plugin[];
	readonly executeHook: (hookName: keyof PluginHook, context: PluginContext) => Effect.Effect<void, PluginError>;
}>() {}

export const PluginManagerLive = Layer.effect(
	PluginManager,
	Effect.sync(() => {
		const plugins = new Map<string, Plugin>();

		return PluginManager.of({
			register: (plugin: Plugin) =>
				Effect.gen(function*(_) {
					if (plugins.has(plugin.name)) {
						return yield* _(Effect.fail(new PluginError({
							message: `Plugin ${plugin.name} is already registered`,
							pluginName: plugin.name,
						})));
					}

					plugins.set(plugin.name, plugin);

					if (plugin.register) {
						const context: PluginContext = {
							app: null,
							config: {},
						};
						yield* _(plugin.register(context));
					}
				}),
			unregister: (pluginName: string) =>
				Effect.gen(function*(_) {
					const plugin = plugins.get(pluginName);
					if (!plugin) {
						return yield* _(Effect.fail(new PluginError({
							message: `Plugin ${pluginName} not found`,
							pluginName,
						})));
					}

					if (plugin.unregister) {
						const context: PluginContext = {
							app: null,
							config: {},
						};
						yield* _(plugin.unregister(context));
					}

					plugins.delete(pluginName);
				}),
			getPlugin: (name: string) => plugins.get(name),
			getAllPlugins: () => Array.from(plugins.values()),
			executeHook: (hookName: keyof PluginHook, context: PluginContext) =>
				Effect.forEach(Array.from(plugins.values()), (plugin) =>
					Effect.gen(function*(_) {
						const hook = plugin.hooks[hookName];
						if (hook) {
							yield* _(hook(context));
						}
					}),
				),
		});
	}),
);
