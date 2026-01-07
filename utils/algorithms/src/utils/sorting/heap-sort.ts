import {
	type Comparator,
	createHeap,
	type Heap,
	heapExtract,
	heapInsert,
	heapIsEmpty,
} from "@wpackages/data-structure";

export function heapSort<T extends number | string>(arr: T[]): T[] {
	if (arr.length <= 1) {
		return [...arr];
	}

	const comparator: Comparator<T> = (a: T, b: T) => {
		if (a < b) return -1;
		if (a > b) return 1;
		return 0;
	};

	let minHeap: Heap<T> = createHeap<T>();

	for (const item of arr) {
		minHeap = heapInsert(minHeap, item, comparator);
	}

	const result: T[] = [];
	while (!heapIsEmpty(minHeap)) {
		const [min, newHeap] = heapExtract(minHeap, comparator);
		minHeap = newHeap;
		if (min !== null) {
			result.push(min);
		}
	}

	return result;
}
