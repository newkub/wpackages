export function strategy<T extends unknown[], R>(
	strategies: Record<string, (...args: T) => R>,
): (strategyName: string, ...args: T) => R {
	return (strategyName, ...args) => {
		const strategy = strategies[strategyName];
		if (!strategy) {
			throw new Error(`Strategy "${strategyName}" not found`);
		}
		return strategy(...args);
	};
}
