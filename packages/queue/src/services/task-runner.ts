import type { Task, TaskResult } from "@wpackages/task";
import { Effect, Schedule } from "effect";
import type { QueueConfig } from "../types/queue";
import { withTimeout } from "../utils/async";

export const runTask = <T_OUT, E>(
	task: Task<any, T_OUT, E>,
	config: QueueConfig,
): Effect.Effect<TaskResult<T_OUT, E>> => {
	const startedAt = new Date();
	const maxRetries = task.retries ?? config.maxRetries ?? 3;
	const retryDelay = config.retryDelay ?? 1000;
	const timeout = task.timeout ?? config.timeout ?? 30000;

	const executeTask = Effect.suspend(() => task.execute(undefined) as Effect.Effect<T_OUT, E>);

	const timedTask = withTimeout(executeTask, timeout);

	const retrySchedule = Schedule.recurs(maxRetries).pipe(
		Schedule.addDelay(() => retryDelay),
	);

	const effect = Effect.retry(timedTask, retrySchedule);

	return effect.pipe(
		Effect.map((result) => {
			const completedAt = new Date();
			return {
				taskId: task.id,
				status: "completed",
				result,
				startedAt,
				completedAt,
				duration: completedAt.getTime() - startedAt.getTime(),
				attempts: 1, // Simplified for now
			} as TaskResult<T_OUT, E>;
		}),
		Effect.catchAll((error) => {
			const completedAt = new Date();
			return Effect.succeed({
				taskId: task.id,
				status: "failed",
				error,
				startedAt,
				completedAt,
				duration: completedAt.getTime() - startedAt.getTime(),
				attempts: maxRetries + 1, // Simplified for now
			} as TaskResult<T_OUT, E>);
		}),
	);
};
