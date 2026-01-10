export function prototype<T>(original: T): () => T {
	return () => {
		if (typeof original === "object" && original !== null) {
			return JSON.parse(JSON.stringify(original)) as T;
		}
		return original;
	};
}

export function clone<T>(original: T): T {
	if (typeof original === "object" && original !== null) {
		return JSON.parse(JSON.stringify(original)) as T;
	}
	return original;
}
