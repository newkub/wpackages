import { Effect, Ref } from "effect";
import { describe, expect, it } from "vitest";
import { appLogic } from "./app";
import { ApiClient, Logger, User } from "./services";

// Mock implementation for the Logger service
const makeTestLogger = (ref: Ref.Ref<ReadonlyArray<string>>): Logger => ({
	log: (message: string) => Ref.update(ref, (messages) => [...messages, message]),
});

// Mock implementation for the ApiClient service
const makeTestApiClient = (users: ReadonlyArray<User>): ApiClient => ({
	getUsers: Effect.succeed(users),
});

describe("appLogic", () => {
	it("should run the application logic correctly", async () => {
		const testUsers: ReadonlyArray<User> = [
			{ id: 101, name: "Test Alice" },
			{ id: 102, name: "Test Bob" },
		];

		const testProgram = Effect.gen(function*(_) {
			const logMessagesRef = yield* _(Ref.make<ReadonlyArray<string>>([]));

			const testLogger = makeTestLogger(logMessagesRef);
			const testApiClient = makeTestApiClient(testUsers);

			// Run the appLogic with mock services
			yield* _(appLogic({ logger: testLogger, apiClient: testApiClient }));

			return yield* _(Ref.get(logMessagesRef));
		});

		const loggedMessages = await Effect.runPromise(testProgram);

		expect(loggedMessages).toContain("App started");
		expect(loggedMessages).toContain(`Fetched users: ${JSON.stringify(testUsers)}`);
		expect(loggedMessages).toContain(
			"Rendering button: <button style=\"color:#007bff\">Click me</button>",
		);
	});
});
