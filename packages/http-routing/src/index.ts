import { Context, Layer } from "effect";

export type HttpRoutingConfigInput = Record<string, unknown>;

export class HttpRoutingConfig extends Context.Tag("HttpRoutingConfig")<
	HttpRoutingConfig,
	{
		readonly config: HttpRoutingConfigInput;
	}
>() {}

export const HttpRoutingConfigLive = (config: HttpRoutingConfigInput) =>
	Layer.succeed(
		HttpRoutingConfig,
		HttpRoutingConfig.of({
			config,
		}),
	);

export type Middleware = unknown;

export const appMiddleware: Middleware = {};
