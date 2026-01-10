export function adapter<T, U>(
	adapt: (input: T) => U,
): (input: T) => U {
	return adapt;
}
