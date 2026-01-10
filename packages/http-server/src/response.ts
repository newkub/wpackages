import { Context, Layer } from "effect";

export type ResponseFactoryOptions = {
	readonly withSecurityHeaders?: boolean;
};

export class ResponseFactory extends Context.Tag("ResponseFactory")<
	ResponseFactory,
	{
		readonly options: ResponseFactoryOptions;
	}
>() {}

export const ResponseFactoryLive = (options: ResponseFactoryOptions) =>
	Layer.succeed(
		ResponseFactory,
		ResponseFactory.of({
			options,
		}),
	);
