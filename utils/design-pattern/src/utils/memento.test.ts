import { describe, expect, it } from "vitest";
import { caretaker, memento } from "./memento";

describe("memento", () => {
	it("should save and restore state", () => {
		const care = caretaker<{ value: number }>();

		const state1 = memento({ value: 1 });
		const state2 = memento({ value: 2 });

		care.save(state1);
		care.save(state2);

		const restored = care.undo();

		expect(restored?.getState()).toEqual({ value: 2 });
	});

	it("should undo in reverse order", () => {
		const care = caretaker<{ value: number }>();

		care.save(memento({ value: 1 }));
		care.save(memento({ value: 2 }));
		care.save(memento({ value: 3 }));

		expect(care.undo()?.getState()).toEqual({ value: 3 });
		expect(care.undo()?.getState()).toEqual({ value: 2 });
		expect(care.undo()?.getState()).toEqual({ value: 1 });
	});
});
