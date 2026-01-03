import { Context, Effect, Layer } from "effect";

// Mock user type
export interface User {
	readonly id: number;
	readonly name: string;
}

export interface ApiClient {
	readonly getUsers: Effect.Effect<ReadonlyArray<User>, Error>;
}

export const ApiClient = Context.Tag<ApiClient>();

export const ApiClientLive = Layer.succeed(
	ApiClient,
	{
		getUsers: Effect.succeed([
			{ id: 1, name: "Alice" },
			{ id: 2, name: "Bob" },
		]).pipe(Effect.delay("100 millis")), // Simulate network delay
	},
);
