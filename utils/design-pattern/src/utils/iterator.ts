export interface Iterator<T> {
	next(): IteratorResult<T>;
	hasNext(): boolean;
}

export class ArrayIterator<T> implements Iterator<T> {
	private index = 0;

	constructor(private collection: T[]) {}

	next(): IteratorResult<T, any> {
		if (this.hasNext()) {
			const value = this.collection[this.index++]!;
			return { value, done: false };
		}
		return { value: undefined as any, done: true };
	}

	hasNext(): boolean {
		return this.index < this.collection.length;
	}
}

export function iterator<T>(collection: T[]): Iterator<T> {
	return new ArrayIterator(collection);
}
