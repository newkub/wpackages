import { patterns } from "@w/design-pattern";
import type { RateLimitConfig, RateLimitStrategy } from "../../types";
import { FixedWindowRateLimiter } from "./strategies/fixed-window";
import { SlidingWindowRateLimiter } from "./strategies/sliding-window";
import { TokenBucketRateLimiter } from "./strategies/token-bucket";
import { DEFAULT_RATE_LIMIT_CONFIG } from "./config";

const { selectFunctionByCondition } = patterns.behavioral.conditionalSelector;

type RateLimiter = FixedWindowRateLimiter | SlidingWindowRateLimiter | TokenBucketRateLimiter;

/**
 * Create rate limiter based on strategy
 */
export const createRateLimiter = (
	config: Partial<RateLimitConfig> = {},
): RateLimiter => {
	const fullConfig: RateLimitConfig = {
		...DEFAULT_RATE_LIMIT_CONFIG,
		...config,
	};

	return selectFunctionByCondition<RateLimitStrategy, RateLimiter>(
		fullConfig.strategy,
		[
			{
				condition: (s: RateLimitStrategy) => s === "fixed",
				fn: (_s: RateLimitStrategy) => new FixedWindowRateLimiter(fullConfig),
			},
			{
				condition: (s: RateLimitStrategy) => s === "sliding",
				fn: (_s: RateLimitStrategy) => new SlidingWindowRateLimiter(fullConfig),
			},
			{
				condition: (s: RateLimitStrategy) => s === "token_bucket",
				fn: (_s: RateLimitStrategy) => new TokenBucketRateLimiter(fullConfig),
			},
		],
		(_s: RateLimitStrategy) => new SlidingWindowRateLimiter(fullConfig), // Default strategy
	);
};
