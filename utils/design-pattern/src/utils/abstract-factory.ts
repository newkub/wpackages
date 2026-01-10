export interface AbstractFactory<T> {
	create(): T;
}

export function abstractFactory<T>(creator: () => T): AbstractFactory<T> {
	return {
		create: creator,
	};
}

export function factoryFamily<T extends Record<string, AbstractFactory<any>>>(
	factories: T,
): T {
	return factories;
}
