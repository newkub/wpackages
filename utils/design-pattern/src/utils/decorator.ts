export function decorator<T extends object>(
	target: T,
	decorators: Partial<T>,
): T {
	return new Proxy(target, {
		get: (obj, prop) => {
			if (prop in decorators && typeof decorators[prop as keyof T] === "function") {
				return decorators[prop as keyof T];
			}
			return obj[prop as keyof T];
		},
	});
}
