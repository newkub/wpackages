import { Layer } from "effect";
import { HttpRoutingConfigLive } from "./routing";
import { ResponseFactoryLive } from "./response";
import type { HttpRoutingConfigInput, ResponseFactoryOptions } from "./index";

export const createHttpServer = (config: HttpRoutingConfigInput, options: ResponseFactoryOptions) => {
	const httpRoutingConfigLayer = HttpRoutingConfigLive(config);
	const responseFactoryLayer = ResponseFactoryLive(options);

	return Layer.mergeAll(httpRoutingConfigLayer, responseFactoryLayer);
};
