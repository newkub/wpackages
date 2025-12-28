import type { PatternMetadata } from "../../core/metadata";

export const metadata: PatternMetadata = {
	name: "Rate Limiter Pattern",
	description: "Controls throughput by allowing a limited number of actions per time window, preventing overload.",
	tags: ["resilience", "stateful", "server"],
};

export interface RateLimiter {
	readonly tryAcquire: (tokens?: number) => boolean;
	readonly availableTokens: () => number;
}

export interface TokenBucketConfig {
	readonly capacity: number;
	readonly refillPerSecond: number;
}

export const createTokenBucket = (
	config: TokenBucketConfig,
	now: () => number = () => Date.now(),
): RateLimiter => {
	let tokens = config.capacity;
	let lastRefill = now();

	const refill = (): void => {
		const t = now();
		const deltaSeconds = Math.max(0, (t - lastRefill) / 1000);
		const refillAmount = deltaSeconds * config.refillPerSecond;
		tokens = Math.min(config.capacity, tokens + refillAmount);
		lastRefill = t;
	};

	const tryAcquire = (n: number = 1): boolean => {
		refill();
		if (tokens < n) {
			return false;
		}
		tokens -= n;
		return true;
	};

	const availableTokens = (): number => {
		refill();
		return Math.floor(tokens);
	};

	return { tryAcquire, availableTokens };
};
