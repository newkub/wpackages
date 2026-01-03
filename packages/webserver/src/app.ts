import { Http, Router } from "@effect/platform";
import { BunHttpServer } from "@effect/platform-bun";
import { Effect, Layer } from "effect";
import { z } from "zod";
import { DatabaseLive } from "./db/database.service";
import { UserService, UserServiceLive } from "./services/user.service";

const App = Http.router.empty.pipe(
	Http.router.get("/", Effect.succeed(Http.response.text("Hello World"))),
	Http.router.get(
		"/users/:id",
		Router.schemaPathParams(z.object({ id: z.string() })).pipe(
			Effect.flatMap(({ id }) =>
				UserService.pipe(
					Effect.flatMap(userService => userService.getUserById(Number(id))),
					Effect.map(user => Http.response.json({ user })),
				)
			),
		),
	),
	Http.server.serve(),
);

const AppLayer = UserServiceLive.pipe(Layer.provide(DatabaseLive));

const port = Number.parseInt(process.env.PORT ?? "3000", 10);

export const main = App.pipe(
	Layer.provide(AppLayer),
	Layer.provide(BunHttpServer.layer({ port })),
);
