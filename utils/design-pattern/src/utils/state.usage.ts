import { state } from "../src/utils/state";

interface CounterState {
	count: number;
	name: string;
}

const counterState = state<CounterState>({
	count: 0,
	name: "Counter",
});

console.log("Initial:", counterState.getState());

counterState.setState({ count: 5 });
console.log("After increment:", counterState.getState());

counterState.setState({ name: "My Counter" });
console.log("After rename:", counterState.getState());

counterState.setState({ count: 10, name: "Final Counter" });
console.log("Final:", counterState.getState());
