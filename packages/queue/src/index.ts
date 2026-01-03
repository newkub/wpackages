// Main entry point for the queue package

// Types
export { QueueEmptyError, QueueFullError, StateInvalidError, TimeoutError } from "./types/error";
export type { QueueConfig, TaskQueue } from "./types/queue";

// Services
export { processNext } from "./services/processor";
export { make as createQueueManager, type QueueManager } from "./services/queue-manager";
