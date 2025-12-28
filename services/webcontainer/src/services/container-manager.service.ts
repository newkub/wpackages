import { Context, Effect, Layer } from "effect";
import type { ContainerConfig, ContainerInfo } from "../types";
import { WebContainerService, WebContainerServiceLive } from "./webcontainer.service";

type ContainerService = {
	readonly start: () => Effect.Effect<void, Error>;
	readonly stop: () => Effect.Effect<void, Error>;
	readonly getInfo: () => ContainerInfo;
	readonly isRunning: () => boolean;
};

type ContainerEntry = {
	readonly id: string;
	readonly service: ContainerService;
	readonly layer: Layer.Layer<WebContainerService, unknown, unknown>;
};

export class ContainerManagerService extends Context.Tag(
	"ContainerManagerService",
)<
	ContainerManagerService,
	{
		readonly create: (config: ContainerConfig) => Effect.Effect<string, Error>;
		readonly createAndStart: (
			config: ContainerConfig,
		) => Effect.Effect<string, Error>;
		readonly get: (
			id: string,
		) => Effect.Effect<ContainerService, Error>;
		readonly getByName: (
			name: string,
		) => Effect.Effect<ContainerService, Error>;
		readonly getAll: () => ReadonlyArray<ContainerService>;
		readonly getAllInfo: () => Effect.Effect<ReadonlyArray<ContainerInfo>, never>;
		readonly stop: (id: string) => Effect.Effect<void, Error>;
		readonly stopAll: () => Effect.Effect<void, Error>;
		readonly remove: (id: string) => Effect.Effect<void, Error>;
		readonly removeAll: () => Effect.Effect<void, Error>;
		readonly count: () => number;
		readonly countRunning: () => number;
	}
>() {}

const unreachableContainerService: ContainerService = {
	start: () => Effect.fail(new Error("unreachable")),
	stop: () => Effect.fail(new Error("unreachable")),
	getInfo: () => {
		throw new Error("unreachable");
	},
	isRunning: () => false,
};

const make = Effect.sync(() => {
	const containers = new Map<string, ContainerEntry>();

	const createEntry = (
		config: ContainerConfig,
	): Effect.Effect<ContainerEntry, Error> =>
		Effect.gen(function*() {
			const layer = WebContainerServiceLive(config);
			const service = yield* WebContainerService.pipe(Effect.provide(layer));
			const info = service.getInfo();

			return { id: info.id, layer, service };
		});

	const getEntryOrFail = (
		id: string,
	): Effect.Effect<ContainerEntry, Error> =>
		Effect.gen(function*() {
			const entry = containers.get(id);
			if (!entry) {
				return yield* Effect.fail(new Error(`Container ${id} not found`));
			}
			return entry;
		});

	return {
		count: () => containers.size,

		countRunning: () =>
			Array.from(containers.values()).filter((e) => e.service.isRunning())
				.length,
		create: (config: ContainerConfig) =>
			Effect.gen(function*() {
				const entry = yield* createEntry(config);
				containers.set(entry.id, entry);
				return entry.id;
			}),

		createAndStart: (config: ContainerConfig) =>
			Effect.gen(function*() {
				const entry = yield* createEntry(config);
				containers.set(entry.id, entry);
				yield* entry.service.start();
				return entry.id;
			}),

		get: (id: string) =>
			Effect.gen(function*() {
				const entry = yield* getEntryOrFail(id);
				return entry.service;
			}),

		getAll: () => Array.from(containers.values()).map((e) => e.service),

		getAllInfo: () => Effect.sync(() => Array.from(containers.values()).map((e) => e.service.getInfo())),

		getByName: (name: string) =>
			Effect.gen(function*() {
				const entry = Array.from(containers.values()).find(
					(e) => e.service.getInfo().name === name,
				);

				if (!entry) {
					yield* Effect.fail(new Error(`Container '${name}' not found`));
					return unreachableContainerService;
				}

				return entry.service;
			}),

		remove: (id: string) =>
			Effect.gen(function*() {
				const entry = yield* getEntryOrFail(id);

				if (entry.service.isRunning()) {
					yield* entry.service.stop();
				}

				containers.delete(id);
			}),

		removeAll: () =>
			Effect.gen(function*() {
				yield* Effect.all(
					Array.from(containers.values())
						.filter((e) => e.service.isRunning())
						.map((e) => e.service.stop()),
					{ concurrency: "unbounded" },
				);
				containers.clear();
			}),

		stop: (id: string) =>
			Effect.gen(function*() {
				const entry = yield* getEntryOrFail(id);
				yield* entry.service.stop();
			}),

		stopAll: () =>
			Effect.all(
				Array.from(containers.values())
					.filter((e) => e.service.isRunning())
					.map((e) => e.service.stop()),
				{ concurrency: "unbounded" },
			).pipe(Effect.asVoid),
	};
});

export const ContainerManagerServiceLive = Layer.effect(ContainerManagerService, make);
