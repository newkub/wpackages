<script lang="ts">
	import { useSignal, useResource } from "@wpackages/signal/svelte";

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

<div>
	<h1>User Data</h1>
	<div>
		<button on:click={() => setUserId(1)}>User 1</button>
		<button on:click={() => setUserId(2)}>User 2</button>
		<button on:click={() => setUserId(3)}>User 3</button>
	</div>
	{#if loading()}
		<p>Loading...</p>
	{:else if error()}
		<p>Error: {String(error())}</p>
	{:else if user()}
		<div>
			<h2>{user().name}</h2>
			<p>Email: {user().email}</p>
			<p>Phone: {user().phone}</p>
			<p>Website: {user().website}</p>
			<button on:click={() => refetch()}>Refetch</button>
		</div>
	{/if}
</div>
