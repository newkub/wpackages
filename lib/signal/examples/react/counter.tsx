import { useSignal, useComputed, useEffect } from "@wpackages/signal/react";

export function Counter() {
	const [count, setCount] = useSignal(0);
	const doubled = useComputed(() => count() * 2);

	useEffect(() => {
		console.log(`Count is: ${count()}`);
	});

	return (
		<div>
			<h1>Counter: {count()}</h1>
			<h2>Doubled: {doubled()}</h2>
			<button onClick={() => setCount((c) => c + 1)}>Increment</button>
			<button onClick={() => setCount((c) => c - 1)}>Decrement</button>
			<button onClick={() => setCount(0)}>Reset</button>
		</div>
	);
}
