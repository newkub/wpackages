import type { Task } from "@wpackages/task";
import { describe, expect, test } from "bun:test";
import { Effect, Ref } from "effect";
import { createQueueManager, processNext, QueueFullError } from ".";

// Helper to create a mock task
const createTask = (
	id: string,
	name: string,
	executeFn: () => Effect.Effect<string, Error>,
): Task<void, string, Error> => ({
	id,
	name,
	execute: executeFn,
});

describe("@wpackages/queue (Effect-based)", () => {
	test("should create a queue manager with default config", async () => {
		const program = Effect.gen(function*() {
			const manager = yield* createQueueManager("test-queue");
			const state = yield* Ref.get(manager.state);
			return state;
		});

		const initialState = await Effect.runPromise(program);

		expect(initialState.name).toBe("test-queue");
		expect(initialState.config.maxConcurrent).toBe(5);
		expect(initialState.config.maxRetries).toBe(3);
		expect(initialState.pending).toBeArrayOfSize(0);
	});

	test("should enqueue a task", async () => {
		const program = Effect.gen(function*() {
			const manager = yield* createQueueManager("test-queue");
			const task = createTask("task1", "Test Task", () => Effect.succeed("success"));
			yield* manager.enqueue(task);
			return yield* Ref.get(manager.state);
		});

		const finalState = await Effect.runPromise(program);

		expect(finalState.pending).toBeArrayOfSize(1);
		expect(finalState.pending[0].id).toBe("task1");
	});

	test("should process a successful task", async () => {
		const program = Effect.gen(function*() {
			const manager = yield* createQueueManager("test-queue");
			const task = createTask("task1", "Successful Task", () => Effect.succeed("great success"));
			yield* manager.enqueue(task);
			yield* processNext(manager);
			return yield* Ref.get(manager.state);
		});

		const finalState = await Effect.runPromise(program);

		expect(finalState.pending).toBeArrayOfSize(0);
		expect(finalState.running).toBeArrayOfSize(0);
		expect(finalState.completed).toBeArrayOfSize(1);
		expect(finalState.failed).toBeArrayOfSize(0);
		expect(finalState.completed[0].taskId).toBe("task1");
		expect(finalState.completed[0].status).toBe("completed");
		expect(finalState.completed[0].result).toBe("great success");
	});

	test("should handle a failing task with retries", async () => {
		const program = Effect.gen(function*() {
			const manager = yield* createQueueManager("test-queue", {
				maxRetries: 2,
				retryDelay: 1, // ms
			});
			const task = createTask("task-fail", "Failing Task", () => Effect.fail(new Error("failure")));
			yield* manager.enqueue(task);
			yield* processNext(manager);
			return yield* Ref.get(manager.state);
		});

		const finalState = await Effect.runPromise(program);

		expect(finalState.completed).toBeArrayOfSize(0);
		expect(finalState.failed).toBeArrayOfSize(1);
		expect(finalState.failed[0].taskId).toBe("task-fail");
		expect(finalState.failed[0].status).toBe("failed");
		expect(finalState.failed[0].attempts).toBe(3); // 1 initial + 2 retries
		expect(finalState.failed[0].error).toEqual(new Error("failure"));
	});

	test("should respect maxConcurrent limit", async () => {
		const program = Effect.gen(function*() {
			const manager = yield* createQueueManager("concurrent-test", {
				maxConcurrent: 1,
			});

			// Manually set state to simulate a running task
			yield* Ref.update(manager.state, (queue) => ({
				...queue,
				running: [
					createTask("running-task", "Running Task", () => Effect.succeed("done")),
				],
			}));

			// Enqueue a new task
			const newTask = createTask("new-task", "New Task", () => Effect.succeed("done"));
			yield* manager.enqueue(newTask);

			// This should fail because the queue is full
			return yield* processNext(manager);
		});

		const result = await Effect.runPromise(Effect.flip(program));
		expect(result).toBeInstanceOf(QueueFullError);
		expect(result.running).toBe(1);
	});
});
