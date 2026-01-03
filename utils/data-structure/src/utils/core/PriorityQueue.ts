import {
  createHeap,
  insert as heapInsert,
  extract as heapExtract,
  peek as heapPeek,
  isEmpty as heapIsEmpty,
  size as heapSize,
  type Heap,
  type Comparator,
} from '../heap';

interface PriorityQueueElement<T> {
  value: T;
  priority: number;
}

export interface PriorityQueue<T> {
  readonly heap: Heap<PriorityQueueElement<T>>;
  readonly comparator: Comparator<PriorityQueueElement<T>>;
}

export const createPriorityQueue = <T>(): PriorityQueue<T> => {
  const comparator: Comparator<PriorityQueueElement<T>> = (a, b) => a.priority - b.priority;
  return {
    heap: createHeap<PriorityQueueElement<T>>(),
    comparator,
  };
};

export const enqueue = <T>(
  pq: PriorityQueue<T>,
  value: T,
  priority: number,
): PriorityQueue<T> => {
  const newElement: PriorityQueueElement<T> = { value, priority };
  const newHeap = heapInsert(pq.heap, newElement, pq.comparator);
  return { ...pq, heap: newHeap };
};

export const dequeue = <T>(
  pq: PriorityQueue<T>,
): [T | null, PriorityQueue<T>] => {
  const [extracted, newHeap] = heapExtract(pq.heap, pq.comparator);
  const newPq: PriorityQueue<T> = { ...pq, heap: newHeap };
  return [extracted?.value ?? null, newPq];
};

export const peek = <T>(pq: PriorityQueue<T>): T | null => {
  const top = heapPeek(pq.heap);
  return top?.value ?? null;
};

export const isEmpty = <T>(pq: PriorityQueue<T>): boolean => {
  return heapIsEmpty(pq.heap);
};

export const size = <T>(pq: PriorityQueue<T>): number => {
  return heapSize(pq.heap);
};