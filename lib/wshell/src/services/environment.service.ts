import { Context, Effect, Layer } from "effect";
import { EnvironmentVariable } from "../types/environment";
import { ConfigService } from "./config.service";

export class EnvironmentService extends Context.Tag("EnvironmentService")<
	EnvironmentService,
	{
		readonly setVar: (name: string, value: string, readonly?: boolean) => Effect.Effect<void, never>;
		readonly getVar: (name: string) => Effect.Effect<string | null, never>;
		readonly unsetVar: (name: string) => Effect.Effect<void, never>;
		readonly listVars: () => Effect.Effect<EnvironmentVariable[], never>;
		readonly expandVars: (input: string) => Effect.Effect<string, never>;
	}
>() {}

export const EnvironmentServiceLive = Layer.effect(
	EnvironmentService,
	Effect.gen(function*() {
		const configService = yield* ConfigService;
		let customVars: Record<string, EnvironmentVariable> = {};

		const loadVars = Effect.gen(function*() {
			const config = yield* configService.getConfig();
			customVars = {};
			for (const [name, value] of Object.entries(config.envVars)) {
				customVars[name] = EnvironmentVariable.make({ name, value });
			}
		});

		yield* loadVars;

		return EnvironmentService.of({
			setVar: (name, value, readonly = false) =>
				Effect.sync(() => {
					customVars[name] = EnvironmentVariable.make({ name, value, readonly });
					process.env[name] = value;
				}),

			getVar: (name) =>
				Effect.sync(() => {
					return process.env[name] ?? customVars[name]?.value ?? null;
				}),

			unsetVar: (name) =>
				Effect.sync(() => {
					const varEntry = customVars[name];
					if (varEntry && !varEntry.readonly) {
						delete customVars[name];
						delete process.env[name];
					}
				}),

			listVars: () =>
				Effect.sync(() => {
					const vars: EnvironmentVariable[] = [];
					for (const [name, varEntry] of Object.entries(customVars)) {
						vars.push(EnvironmentVariable.make({ name, value: varEntry.value, readonly: varEntry.readonly }));
					}
					return vars;
				}),

			expandVars: (input) =>
				Effect.sync(() => {
					return input.replace(/\$(\w+)/g, (match, name) => {
						const value = process.env[name] ?? customVars[name]?.value ?? "";
						return value;
					});
				}),
		});
	}),
);
