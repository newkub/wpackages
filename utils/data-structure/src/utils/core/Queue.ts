export interface Queue<T> {
  readonly items: readonly T[];
}

export const createQueue = <T>(): Queue<T> => ({
  items: [],
});

export const enqueue = <T>(queue: Queue<T>, value: T): Queue<T> => ({
  items: [...queue.items, value],
});

export const dequeue = <T>(queue: Queue<T>): [T | null, Queue<T>] => {
  if (isEmpty(queue)) {
    return [null, queue];
  }
  const [first, ...rest] = queue.items;
  return [first ?? null, { items: rest }];
};

export const peek = <T>(queue: Queue<T>): T | null => {
  return queue.items[0] ?? null;
};

export const isEmpty = <T>(queue: Queue<T>): boolean => {
  return queue.items.length === 0;
};

export const size = <T>(queue: Queue<T>): number => {
  return queue.items.length;
};
