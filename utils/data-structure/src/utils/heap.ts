export type Comparator<T> = (a: T, b: T) => number;
export type Heap<T> = readonly T[];

export const minComparator: Comparator<number> = (a, b) => a - b;
export const maxComparator: Comparator<number> = (a, b) => b - a;

// --- Helper Functions ---
const getParentIndex = (i: number): number => Math.floor((i - 1) / 2);
const getLeftChildIndex = (i: number): number => 2 * i + 1;
const getRightChildIndex = (i: number): number => 2 * i + 2;

const swap = <T>(heap: readonly T[], i: number, j: number): Heap<T> => {
  const newHeap = [...heap];
  const tempI = newHeap[i];
  const tempJ = newHeap[j];
  if (tempI !== undefined && tempJ !== undefined) {
    newHeap[i] = tempJ;
    newHeap[j] = tempI;
  }
  return newHeap;
};

const siftUp = <T>(
  heap: Heap<T>,
  startIndex: number,
  comparator: Comparator<T>,
): Heap<T> => {
  let currentIndex = startIndex;
  let newHeap = heap;
  let parentIndex = getParentIndex(currentIndex);

  while (currentIndex > 0) {
    const current = newHeap[currentIndex];
    const parent = newHeap[parentIndex];
    if (current === undefined || parent === undefined || comparator(current, parent) >= 0) {
      break;
    }
    newHeap = swap(newHeap, currentIndex, parentIndex);
    currentIndex = parentIndex;
    parentIndex = getParentIndex(currentIndex);
  }
  return newHeap;
};

const siftDown = <T>(
  heap: Heap<T>,
  startIndex: number,
  comparator: Comparator<T>,
): Heap<T> => {
  let currentIndex = startIndex;
  const size = heap.length;
  let newHeap = heap;

  while (true) {
    const leftIndex = getLeftChildIndex(currentIndex);
    const rightIndex = getRightChildIndex(currentIndex);
    let smallestIndex = currentIndex;

    const current = newHeap[currentIndex];
    const left = newHeap[leftIndex];
    if (current !== undefined && left !== undefined && leftIndex < size && comparator(left, current) < 0) {
      smallestIndex = leftIndex;
    }

    const smallest = newHeap[smallestIndex];
    const right = newHeap[rightIndex];
    if (smallest !== undefined && right !== undefined && rightIndex < size && comparator(right, smallest) < 0) {
      smallestIndex = rightIndex;
    }

    if (smallestIndex === currentIndex) {
      break;
    }

    newHeap = swap(newHeap, currentIndex, smallestIndex);
    currentIndex = smallestIndex;
  }

  return newHeap;
};

// --- Public API ---
export const createHeap = <T>(): Heap<T> => [];

export const size = <T>(heap: Heap<T>): number => heap.length;

export const isEmpty = <T>(heap: Heap<T>): boolean => heap.length === 0;

export const peek = <T>(heap: Heap<T>): T | null => heap[0] ?? null;

export const insert = <T>(
  heap: Heap<T>,
  value: T,
  comparator: Comparator<T>,
): Heap<T> => {
  const newHeap = [...heap, value];
  return siftUp(newHeap, newHeap.length - 1, comparator);
};

export const extract = <T>(
  heap: Heap<T>,
  comparator: Comparator<T>,
): [T | null, Heap<T>] => {
  if (isEmpty(heap)) {
    return [null, heap];
  }

  const newHeap = swap(heap, 0, heap.length - 1);
  const extractedValue = newHeap[newHeap.length - 1];
  const heapAfterPop = newHeap.slice(0, -1);

  return [extractedValue ?? null, siftDown(heapAfterPop, 0, comparator)];
};
