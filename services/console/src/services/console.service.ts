import { Layer, Logger, LogLevel } from "@wpackages/functional";
import type { PrettyLoggerConfig } from "../types";

export const PrettyLoggerLive = (config: PrettyLoggerConfig = {}) =>
	Logger.pretty.pipe(
		Logger.withMinimumLogLevel(
			config.minLevel ? LogLevel.fromLiteral(config.minLevel) : LogLevel.Info,
		),
	);

export const JsonLoggerLive = Logger.json;
