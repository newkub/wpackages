import { Effect, Ref } from "effect";
import { QueueEmptyError, QueueFullError, StateInvalidError } from "../types/error";
import type { QueueManager } from "./queue-manager";
import { runTask } from "./task-runner";

/**
 * Process next task from queue using a QueueManager
 */
export const processNext = <T_OUT, E>(
	manager: QueueManager<T_OUT, E>,
): Effect.Effect<
	void, // Returns void as it mutates the manager's state
	QueueEmptyError | QueueFullError | StateInvalidError
> =>
	Effect.gen(function*() {
		const queue = yield* Ref.get(manager.state);

		if (queue.pending.length === 0) {
			return yield* Effect.fail(new QueueEmptyError({ queueName: queue.name }));
		}

		if (queue.running.length >= (queue.config.maxConcurrent ?? 5)) {
			const { maxConcurrent } = queue.config;
			return yield* Effect.fail(
				new QueueFullError({
					queueName: queue.name,
					running: queue.running.length,
					...(maxConcurrent !== undefined && { maxConcurrent }),
				}),
			);
		}

		const [task] = queue.pending;
		if (!task) {
			return yield* Effect.fail(new StateInvalidError({ queueName: queue.name }));
		}

		yield* manager.moveToRunning(task);

		const taskResult = yield* runTask(task, queue.config);

		yield* manager.moveToFinished(taskResult);
	});
