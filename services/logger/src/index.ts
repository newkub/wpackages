import { Context, Effect, Layer, type Tag } from "effect";

// --------------------------------------------------------------------------------
// Models
// --------------------------------------------------------------------------------

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogEntry = {
	readonly level: LogLevel;
	readonly message: string;
	readonly time: number;
	readonly meta?: Readonly<Record<string, unknown>>;
};

export type LoggerConfig = {
	readonly minLevel?: LogLevel;
	readonly redactKeys?: ReadonlyArray<string>;
};

// --------------------------------------------------------------------------------
// Services
// --------------------------------------------------------------------------------

export interface Console {
	readonly log: (line: string) => Effect.Effect<void>;
	readonly warn: (line: string) => Effect.Effect<void>;
	readonly error: (line: string) => Effect.Effect<void>;
}

export const Console: Tag<Console> = Context.Tag<Console>("@wpackages/logger/Console");

export interface Logger {
	readonly log: (entry: LogEntry) => Effect.Effect<void>;
}

export const Logger: Tag<Logger> = Context.Tag<Logger>("@wpackages/logger/Logger");

const levelRank: Record<LogLevel, number> = {
	debug: 10,
	info: 20,
	warn: 30,
	error: 40,
};

const redact = (
	meta: Readonly<Record<string, unknown>> | undefined,
	keys: ReadonlyArray<string>,
): Readonly<Record<string, unknown>> | undefined => {
	if (!meta) return undefined;
	if (keys.length === 0) return meta;
	const out: Record<string, unknown> = { ...meta };
	for (const k of keys) {
		if (k in out) out[k] = "[REDACTED]";
	}
	return out;
};

export const makeLogger = Effect.gen(function*() {
	const console = yield* Console;
	const config = yield* LoggerConfigTag;

	const minLevel = config.minLevel ?? "info";
	const redactKeys = config.redactKeys ?? [];

	const log = (entry: LogEntry): Effect.Effect<void> => {
		if (levelRank[entry.level] < levelRank[minLevel]) {
			return Effect.void;
		}
		const safeMeta = redact(entry.meta, redactKeys);
		const payload = safeMeta ? { ...entry, meta: safeMeta } : entry;
		const line = JSON.stringify(payload);

		switch (entry.level) {
			case "error":
				return console.error(line);
			case "warn":
				return console.warn(line);
			default:
				return console.log(line);
		}
	};

	return { log } satisfies Logger;
});

export const ConsoleLive = Layer.succeed(
	Console,
	{
		log: (line: string) => Effect.sync(() => console.log(line)),
		warn: (line: string) => Effect.sync(() => console.warn(line)),
		error: (line: string) => Effect.sync(() => console.error(line)),
	},
);

export const LoggerConfigTag: Tag<LoggerConfig> = Context.Tag<LoggerConfig>("@wpackages/logger/LoggerConfig");

export const LoggerLive = Layer.effect(Logger, makeLogger).pipe(
	Layer.provide(Layer.succeed(LoggerConfigTag, { redactKeys: ["token", "password", "secret"] })),
);

export const DefaultLoggerLayer = ConsoleLive.pipe(Layer.provide(LoggerLive));

export const log = (level: LogLevel, message: string, meta?: Readonly<Record<string, unknown>>) =>
	Effect.flatMap(Logger, (svc) => svc.log({ level, message, time: Date.now(), ...(meta ? { meta } : {}) }));

export const debug = (message: string, meta?: Readonly<Record<string, unknown>>) => log("debug", message, meta);
export const info = (message: string, meta?: Readonly<Record<string, unknown>>) => log("info", message, meta);
export const warn = (message: string, meta?: Readonly<Record<string, unknown>>) => log("warn", message, meta);
export const error = (message: string, meta?: Readonly<Record<string, unknown>>) => log("error", message, meta);
