import type { PatternMetadata } from "../../core/metadata";

export const metadata: PatternMetadata = {
	name: "Circuit Breaker Pattern",
	description:
		"Prevents cascading failures by short-circuiting calls after repeated errors, then probing recovery after a timeout.",
	tags: ["resilience", "stateful", "server"],
};

export type CircuitState = "closed" | "open" | "half_open";

export interface CircuitBreakerConfig {
	readonly failureThreshold: number;
	readonly resetTimeoutMs: number;
}

export interface CircuitBreaker {
	readonly getState: () => CircuitState;
	readonly execute: <A>(op: () => Promise<A>) => Promise<A>;
	readonly reset: () => void;
}

export const createCircuitBreaker = (
	config: CircuitBreakerConfig,
	now: () => number = () => Date.now(),
): CircuitBreaker => {
	let state: CircuitState = "closed";
	let failures = 0;
	let openedAt = 0;

	const transitionTo = (s: CircuitState): void => {
		state = s;
		if (s === "open") {
			openedAt = now();
		}
		if (s === "closed") {
			failures = 0;
			openedAt = 0;
		}
	};

	const reset = (): void => transitionTo("closed");

	const getState = (): CircuitState => {
		if (state === "open" && now() - openedAt >= config.resetTimeoutMs) {
			state = "half_open";
		}
		return state;
	};

	const execute = async <A>(op: () => Promise<A>): Promise<A> => {
		const s = getState();
		if (s === "open") {
			throw new Error("CircuitBreakerOpen");
		}

		try {
			const out = await op();
			if (state === "half_open") {
				transitionTo("closed");
			}
			return out;
		} catch (e) {
			failures += 1;
			if (failures >= config.failureThreshold) {
				transitionTo("open");
			}
			throw e;
		}
	};

	return { getState, execute, reset };
};
