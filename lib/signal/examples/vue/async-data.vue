<script setup lang="ts">
import { useSignal, useResource } from "@wpackages/signal/vue";

const fetchUser = async (id: number) => {
	const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
	if (!response.ok) {
		throw new Error("Failed to fetch user");
	}
	return response.json();
};

const [userId, setUserId] = useSignal(1);
const [user, { loading, error, refetch }] = useResource(() => fetchUser(userId()));
</script>

<template>
	<div>
		<h1>User Data</h1>
		<div>
			<button @click="setUserId(1)">User 1</button>
			<button @click="setUserId(2)">User 2</button>
			<button @click="setUserId(3)">User 3</button>
		</div>
		<p v-if="loading()">Loading...</p>
		<p v-if="error()">Error: {{ String(error()) }}</p>
		<div v-if="user()">
			<h2>{{ user().name }}</h2>
			<p>Email: {{ user().email }}</p>
			<p>Phone: {{ user().phone }}</p>
			<p>Website: {{ user().website }}</p>
			<button @click="refetch()">Refetch</button>
		</div>
	</div>
</template>
