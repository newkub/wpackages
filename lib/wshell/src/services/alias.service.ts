import { Alias } from "../types/alias";
import { ConfigService } from "./config.service";
import { Context, Effect, Layer } from "effect";

export class AliasService extends Context.Tag("AliasService")<
	AliasService,
	{
		readonly addAlias: (name: string, command: string, description?: string) => Effect.Effect<void, never>;
		readonly removeAlias: (name: string) => Effect.Effect<void, never>;
		readonly getAlias: (name: string) => Effect.Effect<Alias | null, never>;
		readonly listAliases: () => Effect.Effect<Alias[], never>;
		readonly expandAlias: (input: string) => Effect.Effect<string, never>;
		readonly saveAliases: () => Effect.Effect<void, never>;
	}
>() {}

export const AliasServiceLive = Layer.effect(
	AliasService,
	Effect.gen(function*() {
		const configService = yield* ConfigService;
		let aliases: Record<string, Alias> = {};

		const loadAliases = Effect.gen(function*() {
			const config = yield* configService.getConfig();
			aliases = {};
			for (const [name, command] of Object.entries(config.aliases)) {
				aliases[name] = Alias.make({ name, command });
			}
		});

		yield* loadAliases;

		return AliasService.of({
			addAlias: (name, command, description) =>
				Effect.sync(() => {
					aliases[name] = Alias.make({ name, command, description });
				}),

			removeAlias: (name) =>
				Effect.sync(() => {
					delete aliases[name];
				}),

			getAlias: (name) =>
				Effect.sync(() => {
					return aliases[name] ?? null;
				}),

			listAliases: () =>
				Effect.sync(() => {
					return Object.values(aliases);
				}),

			expandAlias: (input) =>
				Effect.sync(() => {
					const parts = input.split(" ");
					const firstWord = parts[0];
					const alias = aliases[firstWord];
					if (alias) {
						const args = parts.slice(1).join(" ");
						return args ? `${alias.command} ${args}` : alias.command;
					}
					return input;
				}),

			saveAliases: () =>
				Effect.sync(() => {
					const newAliases: Record<string, string> = {};
					for (const alias of Object.values(aliases)) {
						newAliases[alias.name] = alias.command;
					}
				}),
		});
	}),
);
