<script lang="ts">
	import { useSignal, useComputed, useEffect } from "@wpackages/signal/svelte";

	const [count, setCount] = useSignal(0);
	const doubled = useComputed(() => count() * 2);

	useEffect(() => {
		console.log(`Count is: ${count()}`);
	});
</script>

<div>
	<h1>Counter: {count()}</h1>
	<h2>Doubled: {doubled()}</h2>
	<button on:click={() => setCount((c) => c + 1)}>Increment</button>
	<button on:click={() => setCount((c) => c - 1)}>Decrement</button>
	<button on:click={() => setCount(0)}>Reset</button>
</div>
