import { patterns } from "@w/design-pattern";
import { CircuitBreaker } from "./CircuitBreaker";
import type { CircuitBreakerStats, CircuitState } from "./types";

const { selectByCondition } = patterns.behavioral.conditionalSelector;

/**
 * Calculate circuit breaker health score (0-100)
 */
export const calculateHealthScore = (stats: CircuitBreakerStats): number => {
	const total = stats.failures + stats.successes;

	if (total === 0) {
		return 100;
	}

	const successRate = (stats.successes / total) * 100;

	return selectByCondition(
		stats.state,
		[
			{ condition: (state: CircuitState) => state === "open", result: 0 },
			{ condition: (state: CircuitState) => state === "half_open", result: successRate * 0.7 },
		],
		successRate, // Default for "closed"
	);
};

/**
 * Check if circuit breaker is healthy
 */
export const isCircuitHealthy = (
	circuitBreaker: CircuitBreaker,
	minHealthScore: number = 70,
): boolean => {
	const stats = circuitBreaker.getStats();
	const healthScore = calculateHealthScore(stats);
	return healthScore >= minHealthScore;
};
