import {
  type Heap,
  type Comparator,
  createHeap,
  insert as heapInsert,
  extract as heapExtract,
  peek as heapPeek,
  isEmpty as heapIsEmpty,
  size as heapSize,
} from './heap';

export interface PriorityQueueElement<T> {
  readonly value: T;
  readonly priority: number;
}

export type PriorityQueue<T> = Heap<PriorityQueueElement<T>>;

const comparator: Comparator<PriorityQueueElement<any>> = (a, b) => a.priority - b.priority;

export const createPriorityQueue = <T>(): PriorityQueue<T> => createHeap();

export const enqueue = <T>(
  pq: PriorityQueue<T>,
  value: T,
  priority: number,
): PriorityQueue<T> => {
  return heapInsert(pq, { value, priority }, comparator);
};

export const dequeue = <T>(
  pq: PriorityQueue<T>,
): [T | null, PriorityQueue<T>] => {
  const [element, newHeap] = heapExtract(pq, comparator);
  return [element?.value ?? null, newHeap];
};

export const peek = <T>(pq: PriorityQueue<T>): T | null => {
  const element = heapPeek(pq);
  return element?.value ?? null;
};

export const isEmpty = <T>(pq: PriorityQueue<T>): boolean => heapIsEmpty(pq);

export const size = <T>(pq: PriorityQueue<T>): number => heapSize(pq);
