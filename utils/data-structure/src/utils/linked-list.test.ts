import { describe, expect, it } from "vitest";
import { append, createLinkedList, getHeadValue, prepend, removeFirst, size, toArray } from "./linked-list";

describe("Immutable Linked List", () => {
	it("should prepend values immutably", () => {
		const list0 = createLinkedList<number>();
		const list1 = prepend(list0, 10);
		const list2 = prepend(list1, 20);

		expect(toArray(list0)).toEqual([]);
		expect(toArray(list1)).toEqual([10]);
		expect(toArray(list2)).toEqual([20, 10]);
	});

	it("should append values immutably", () => {
		const list0 = createLinkedList<number>();
		const list1 = append(list0, 10);
		const list2 = append(list1, 20);
		const list3 = append(list2, 30);

		expect(toArray(list0)).toEqual([]);
		expect(toArray(list1)).toEqual([10]);
		expect(toArray(list2)).toEqual([10, 20]);
		expect(toArray(list3)).toEqual([10, 20, 30]);
	});

	it("should remove the first element immutably", () => {
		let list = createLinkedList<number>();
		list = prepend(list, 10);
		list = prepend(list, 20);

		const [val1, list1] = removeFirst(list);
		expect(val1).toBe(20);
		expect(toArray(list1)).toEqual([10]);

		// Original list is unchanged
		expect(toArray(list)).toEqual([20, 10]);

		const [val2, list2] = removeFirst(list1);
		expect(val2).toBe(10);
		expect(list2).toBeNull();

		const [val3, list3] = removeFirst(list2);
		expect(val3).toBeNull();
		expect(list3).toBeNull();
	});

	it("should calculate the size correctly", () => {
		let list = createLinkedList<number>();
		expect(size(list)).toBe(0);
		list = append(list, 10);
		expect(size(list)).toBe(1);
		list = append(list, 20);
		expect(size(list)).toBe(2);
	});

	it("should get the head value", () => {
		let list = createLinkedList<number>();
		expect(getHeadValue(list)).toBeNull();
		list = prepend(list, 10);
		expect(getHeadValue(list)).toBe(10);
		list = prepend(list, 20);
		expect(getHeadValue(list)).toBe(20);
	});
});
