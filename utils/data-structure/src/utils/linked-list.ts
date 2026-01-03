import { ListNode } from "../types/list-node";

export type LinkedList<T> = ListNode<T> | null;

export const createLinkedList = <T>(): LinkedList<T> => null;

export const prepend = <T>(list: LinkedList<T>, value: T): LinkedList<T> => {
	return new ListNode(value, list);
};

export const append = <T>(list: LinkedList<T>, value: T): LinkedList<T> => {
	const newNode = new ListNode(value);
	if (list === null) {
		return newNode;
	}

	// To maintain immutability, we must recreate nodes along the path.
	const newHead = new ListNode(list.value);
	let current = newHead;
	let originalCurrent = list.next;

	while (originalCurrent) {
		current.next = new ListNode(originalCurrent.value);
		current = current.next;
		originalCurrent = originalCurrent.next;
	}

	current.next = newNode;
	return newHead;
};

export const toArray = <T>(list: LinkedList<T>): T[] => {
	const result: T[] = [];
	let currentNode = list;
	while (currentNode) {
		result.push(currentNode.value);
		currentNode = currentNode.next;
	}
	return result;
};

export const size = <T>(list: LinkedList<T>): number => {
	let count = 0;
	let currentNode = list;
	while (currentNode) {
		count++;
		currentNode = currentNode.next;
	}
	return count;
};

export const removeFirst = <T>(list: LinkedList<T>): [T | null, LinkedList<T>] => {
	if (list === null) {
		return [null, null];
	}
	return [list.value, list.next];
};

export const getHead = <T>(list: LinkedList<T>): ListNode<T> | null => {
	return list;
};

export const getHeadValue = <T>(list: LinkedList<T>): T | null => {
	return list?.value ?? null;
};
