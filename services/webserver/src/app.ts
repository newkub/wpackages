import { HttpServer } from "@effect/platform";
import { BunHttpServer } from "@effect/platform-bun";
import { DatabaseLive } from "@wpackages/database";
import { ResponseFactoryLive, appMiddleware, HttpRoutingConfigLive } from "@wpackages/http-server";
import { Effect, Layer } from "effect";
import { ConfigLive } from "./config";
import { appRoutes } from "./http/routes";
import { type User, UserNotFoundError, UserService, UserServiceLive } from "./services/user.service";

const UserServiceInMemory = Layer.succeed(
    UserService,
    UserService.of({
        getUser: (id: number) => {
            if (id === 1) {
                const user: User = { id: 1, name: "John Doe" };
                return Effect.succeed(user);
            }
            return Effect.fail(new UserNotFoundError({ id }));
        },
    }),
);

export const main = Layer.unwrapEffect(Effect.gen(function*(_) {
    const config = yield* _(ConfigLive);
    const dbUrl = config.DATABASE_URL ?? config.DB_URL;

    const responseFactoryLayer = ResponseFactoryLive({
        withSecurityHeaders: config.ENABLE_SECURITY_HEADERS,
    });
    const httpRoutingConfigLayer = HttpRoutingConfigLive(config);
    const serverLayer = BunHttpServer.layer({ port: config.PORT });
    const databaseLayer = dbUrl ? DatabaseLive(dbUrl) : Layer.empty;
    const userLayer = config.TEST_MODE || !dbUrl ? UserServiceInMemory : UserServiceLive;

    const runtimeLayer = Layer.mergeAll(
        httpRoutingConfigLayer,
        responseFactoryLayer,
        databaseLayer,
        userLayer,
        serverLayer,
    );

    const middleware = appMiddleware;
    const app = appRoutes.pipe(
        HttpServer.serve(middleware),
        HttpServer.withLogAddress,
    );

    return Layer.provide(app, runtimeLayer);
}));
