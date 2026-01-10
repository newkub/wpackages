export function factory<T>(creator: () => T): () => T {
	return creator;
}

export function factoryWithParams<T, P extends unknown[]>(
	creator: (...params: P) => T,
): (...params: P) => T {
	return creator;
}
