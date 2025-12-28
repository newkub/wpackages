import { patterns } from "@w/design-pattern";

/**
 * retry - Retry function on failure
 *
 * @param fn - Function to retry
 * @param options - Retry options
 * @returns Promise with result
 */
export const retry = <T>(
	fn: () => Promise<T>,
	_options: {
		maxAttempts?: number;
		delay?: number;
		backoff?: "constant" | "linear" | "exponential";
	} = {},
): Promise<T> => {
	const { maxAttempts = 3, delay = 1000, backoff = "constant" } = _options;

	const calculateNextDelay = patterns.behavioral.conditionalSelector.selectFunctionByCondition(
		backoff,
		[
			{
				condition: (b: typeof backoff) => b === "exponential",
				fn: (d: number) => d * 2,
			},
			{
				condition: (b: typeof backoff) => b === "linear",
				fn: (d: number) => d + delay,
			},
		],
		(d: number) => d, // constant backoff
	);

	let lastError: Error | undefined;

	return new Promise((resolve, reject) => {
		const attempt = (count: number, currentDelay: number) => {
			fn()
				.then(resolve)
				.catch((error) => {
					lastError = error instanceof Error ? error : new Error(String(error));

					if (count < maxAttempts - 1) {
						const nextDelay = calculateNextDelay(currentDelay);
						setTimeout(() => attempt(count + 1, nextDelay), currentDelay);
					} else {
						reject(lastError);
					}
				});
		};

		attempt(0, delay);
	});
};
