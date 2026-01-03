export interface Stack<T> {
  readonly items: readonly T[];
}

export const createStack = <T>(): Stack<T> => ({
  items: [],
});

export const push = <T>(stack: Stack<T>, value: T): Stack<T> => ({
  items: [...stack.items, value],
});

export const pop = <T>(stack: Stack<T>): [T | null, Stack<T>] => {
  if (isEmpty(stack)) {
    return [null, stack];
  }
  const last = stack.items[stack.items.length - 1];
  const rest = stack.items.slice(0, -1);
  return [last ?? null, { items: rest }];
};

export const peek = <T>(stack: Stack<T>): T | null => {
  return stack.items[stack.items.length - 1] ?? null;
};

export const isEmpty = <T>(stack: Stack<T>): boolean => {
  return stack.items.length === 0;
};

export const size = <T>(stack: Stack<T>): number => {
  return stack.items.length;
};
