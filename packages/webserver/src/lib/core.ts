import { Cause, Effect, Layer } from "effect";
import { HttpError } from "../error";
import { WContext } from "./context";
import { type EffectRouteHandler, Router, type RouteSchemas } from "./router";

// --- Hook & Plugin Definitions ---
export type HookContext = WContext & { req: Request };
type BeforeHandleHook = (
	ctx: HookContext,
) => Response | void | Promise<Response | void>;
type AfterHandleHook = (
	ctx: HookContext,
	response: Response,
) => Response | void | Promise<Response | void>;

export interface Plugin {
	name: string;
	setup: (app: WServer) => void;
}

// --- W-Server Core ---
export class WServer<R = never> {
	readonly router = new Router();
	private beforeHandleHooks: BeforeHandleHook[] = [];
	private afterHandleHooks: AfterHandleHook[] = [];
	private effectLayer: Layer.Layer<R> = Layer.empty as Layer.Layer<R>;

	use(plugin: Plugin): WServer<R> {
		// biome-ignore lint/suspicious/noExplicitAny: Plugin setup modifies the server instance
		plugin.setup(this as any);
		return this;
	}

	setEffectLayer<R2, E, A>(layer: Layer.Layer<R2, E, A>): WServer<R | R2> {
		const self = this as WServer<R | R2>;
		self.effectLayer = Layer.merge(self.effectLayer, layer as Layer.Layer<R2>);
		return self;
	}

	// --- Hook Registration ---
	beforeHandle(hook: BeforeHandleHook) {
		this.beforeHandleHooks.push(hook);
		return this;
	}

	afterHandle(hook: AfterHandleHook) {
		this.afterHandleHooks.push(hook);
		return this;
	}

	// --- Router Methods (delegated) ---
	get<S extends RouteSchemas, R, E>(
		path: string,
		handler: EffectRouteHandler<S, R, E>,
		schemas?: S,
	) {
		this.router.get(path, handler, schemas);
		return this;
	}

	post<S extends RouteSchemas, R, E>(
		path: string,
		handler: EffectRouteHandler<S, R, E>,
		schemas?: S,
	) {
		this.router.post(path, handler, schemas);
		return this;
	}

	// --- Main Request Handler ---
	async fetch(req: Request): Promise<Response> {
		const context = new WContext();

		for (const hook of this.beforeHandleHooks) {
			const response = await hook({ ...context, req });
			if (response instanceof Response) return response;
		}

		const handleEffect = this.router.handleEffect(req, context).pipe(
			Effect.catchAllCause((cause) => {
				console.error("Unhandled error in router:", Cause.pretty(cause));
				const error = Cause.failureOption(cause);
				if (error._tag === "Some" && error.value instanceof HttpError) {
					return Effect.succeed(
						new Response(error.value.message, { status: error.value.status }),
					);
				}
				return Effect.succeed(
					new Response("Internal Server Error", { status: 500 }),
				);
			}),
		);

		const runnable = handleEffect.pipe(Effect.provide(this.effectLayer));
		let response = await Effect.runPromise(runnable);

		for (const hook of this.afterHandleHooks) {
			const modifiedResponse = await hook({ ...context, req }, response);
			if (modifiedResponse instanceof Response) response = modifiedResponse;
		}

		return response;
	}

	listen(port = 3000) {
		const server = Bun.serve({
			port,
			fetch: this.fetch.bind(this),
		});
		console.log(`Listening on http://localhost:${server.port}`);
		return server;
	}
}
