/**
 * ตัวอย่างการใช้งาน createTask
 *
 * Run: bun run packages/task/src/utils/creators.usage.ts
 */

import type { Result } from "../types";
import { createTask, taskError } from "./creators";

// Helper functions to create Success and Failure results
const success = <T>(value: T): Result<never, T> => ({ _tag: "Success", value });
const failure = <E>(error: E): Result<E, never> => ({ _tag: "Failure", error });

// 1. Define an example task execution function
// This function simulates fetching user data from an API.
async function fetchUserData(userId: number): Promise<Result<{ message: string }, { id: number; name: string }>> {
	if (userId <= 0) {
		return failure({ message: "Invalid user ID" });
	}

	// Simulate network delay
	await new Promise(resolve => setTimeout(resolve, 100));

	// Simulate a successful API call
	return success({ id: userId, name: "John Doe" });
}

// 2. Create a basic task
const basicTask = createTask("Fetch User Data", fetchUserData);

console.log("--- Basic Task ---");
console.log(basicTask);

// 3. Create a task with all available options
const advancedTask = createTask("Process High-Priority Data", fetchUserData, {
	id: "custom-id-123",
	priority: "high",
	timeout: 5000, // 5 seconds
	retries: 3,
	metadata: { source: "api-v2" },
});

console.log("\n--- Advanced Task ---");
console.log(advancedTask);

// 4. Simulate running a task and handling the result
async function runAndLogTask() {
	console.log("\n--- Simulating Task Execution ---");

	const input = 1;
	console.log(`Running task '${advancedTask.name}' with input: ${input}`);

	const result = await advancedTask.execute(input);

	if (result._tag === "Success") {
		console.log("Task completed successfully:", result.value);
	} else {
		console.error("Task failed:", result.error);
	}

	// Simulate a failing case
	const failingInput = -1;
	console.log(`\nRunning task '${advancedTask.name}' with input: ${failingInput}`);
	const failingResult = await advancedTask.execute(failingInput);
	if (failingResult._tag === "Failure") {
		console.error("Task failed as expected:", failingResult.error);
	}
}

runAndLogTask();

// 5. Example of creating a custom task error
const error = taskError("Failed to connect to the database", {
	taskId: advancedTask.id,
	taskName: advancedTask.name,
	code: "DB_CONN_ERROR",
	metadata: { attempt: 3 },
});

console.log("\n--- Custom Task Error ---");
console.log(error);
