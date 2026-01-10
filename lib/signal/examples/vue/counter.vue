<script setup lang="ts">
import { useSignal, useComputed, useEffect } from "@wpackages/signal/vue";

const [count, setCount] = useSignal(0);
const doubled = useComputed(() => count() * 2);

useEffect(() => {
	console.log(`Count is: ${count()}`);
});
</script>

<template>
	<div>
		<h1>Counter: {{ count() }}</h1>
		<h2>Doubled: {{ doubled() }}</h2>
		<button @click="setCount((c) => c + 1)">Increment</button>
		<button @click="setCount((c) => c - 1)">Decrement</button>
		<button @click="setCount(0)">Reset</button>
	</div>
</template>
