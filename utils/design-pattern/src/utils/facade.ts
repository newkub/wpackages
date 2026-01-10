export function facade<T extends Record<string, (...args: any[]) => any>>(
	operations: T,
): T {
	return new Proxy(operations, {
		get: (target, prop) => {
			if (prop in target) {
				return target[prop as keyof T];
			}
			throw new Error(`Operation ${String(prop)} not found`);
		},
	});
}
