import type { PatternMetadata } from "../../core/metadata";

export const metadata: PatternMetadata = {
	name: "Retry Pattern",
	description:
		"Retries a failing operation using a configurable policy, improving resilience against transient failures.",
	tags: ["resilience", "functional", "server"],
};

export interface RetryPolicy {
	readonly maxAttempts: number;
	readonly delayMs: (attempt: number) => number;
}

export const fixedDelay = (maxAttempts: number, delay: number): RetryPolicy => ({
	maxAttempts,
	delayMs: () => delay,
});

export const exponentialBackoff = (maxAttempts: number, baseDelay: number): RetryPolicy => ({
	maxAttempts,
	delayMs: (attempt) => baseDelay * 2 ** Math.max(0, attempt - 1),
});

export const retryAsync = async <A>(
	op: (attempt: number) => Promise<A>,
	policy: RetryPolicy,
	sleep: (ms: number) => Promise<void> = (ms) => new Promise((r) => setTimeout(r, ms)),
): Promise<A> => {
	let lastError: unknown;
	for (let attempt = 1; attempt <= policy.maxAttempts; attempt += 1) {
		try {
			return await op(attempt);
		} catch (e) {
			lastError = e;
			if (attempt === policy.maxAttempts) {
				throw lastError;
			}
			await sleep(policy.delayMs(attempt));
		}
	}
	throw lastError;
};
