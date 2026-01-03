import type { Task, TaskResult } from "@wpackages/task";
import { Effect, Ref } from "effect";
import type { QueueConfig, TaskQueue } from "../types/queue";

export interface QueueManager<T_OUT, E> {
	readonly state: Ref.Ref<TaskQueue<T_OUT, E>>;
	readonly enqueue: (task: Task<any, T_OUT, E>) => Effect.Effect<void>;
	readonly getStats: Effect.Effect<{
		pending: number;
		running: number;
		completed: number;
		failed: number;
		total: number;
	}>;
	readonly clearCompleted: Effect.Effect<void>;
	readonly clearFailed: Effect.Effect<void>;
	readonly moveToRunning: (task: Task<any, T_OUT, E>) => Effect.Effect<void>;
	readonly moveToFinished: (taskResult: TaskResult<T_OUT, E>) => Effect.Effect<void>;
}

export const make = <T_OUT, E>(
	name: string,
	config: QueueConfig = {},
): Effect.Effect<QueueManager<T_OUT, E>> =>
	Effect.gen(function*() {
		const initialState: TaskQueue<T_OUT, E> = {
			name,
			config: {
				maxConcurrent: config.maxConcurrent ?? 5,
				maxRetries: config.maxRetries ?? 3,
				retryDelay: config.retryDelay ?? 1000,
				timeout: config.timeout ?? 30000,
				priority: config.priority ?? false,
			},
			pending: [],
			running: [],
			completed: [],
			failed: [],
		};

		const state = yield* Ref.make(initialState);

		const enqueue = (task: Task<any, T_OUT, E>) =>
			Ref.update(state, (queue) => {
				const newPending = [...queue.pending, task];
				if (queue.config.priority) {
					newPending.sort((a, b) => {
						const priorities = { low: 0, normal: 1, high: 2, critical: 3 };
						return (
							priorities[b.priority ?? "normal"] - priorities[a.priority ?? "normal"]
						);
					});
				}
				return { ...queue, pending: newPending };
			});

		const getStats = Ref.get(state).pipe(
			Effect.map((queue) => ({
				pending: queue.pending.length,
				running: queue.running.length,
				completed: queue.completed.length,
				failed: queue.failed.length,
				total: queue.pending.length
					+ queue.running.length
					+ queue.completed.length
					+ queue.failed.length,
			})),
		);

		const clearCompleted = Ref.update(state, (queue) => ({ ...queue, completed: [] }));
		const clearFailed = Ref.update(state, (queue) => ({ ...queue, failed: [] }));

		const moveToRunning = (task: Task<any, T_OUT, E>) =>
			Ref.update(state, (queue) => ({
				...queue,
				pending: queue.pending.filter((t) => t.id !== task.id),
				running: [...queue.running, task],
			}));

		const moveToFinished = (taskResult: TaskResult<T_OUT, E>) =>
			Ref.update(state, (queue) => {
				const isSuccess = taskResult.status === "completed";
				return {
					...queue,
					running: queue.running.filter((t) => t.id !== taskResult.taskId),
					completed: isSuccess ? [...queue.completed, taskResult] : queue.completed,
					failed: !isSuccess ? [...queue.failed, taskResult] : queue.failed,
				};
			});

		return {
			state,
			enqueue,
			getStats,
			clearCompleted,
			clearFailed,
			moveToRunning,
			moveToFinished,
		};
	});
