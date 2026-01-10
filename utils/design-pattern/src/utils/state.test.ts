import { describe, expect, it } from "vitest";
import { state } from "./state";

describe("state", () => {
	it("should get initial state", () => {
		const initialState = { count: 0, name: "test" };
		const stateManager = state(initialState);

		expect(stateManager.getState()).toEqual(initialState);
	});

	it("should update state", () => {
		const initialState = { count: 0, name: "test" };
		const stateManager = state(initialState);

		stateManager.setState({ count: 5 });

		expect(stateManager.getState()).toEqual({ count: 5, name: "test" });
	});

	it("should update multiple properties", () => {
		const initialState = { count: 0, name: "test" };
		const stateManager = state(initialState);

		stateManager.setState({ count: 5, name: "updated" });

		expect(stateManager.getState()).toEqual({ count: 5, name: "updated" });
	});

	it("should return copy of state", () => {
		const initialState = { count: 0 };
		const stateManager = state(initialState);

		const state1 = stateManager.getState();
		const state2 = stateManager.getState();

		expect(state1).not.toBe(state2);
		expect(state1).toEqual(state2);
	});
});
