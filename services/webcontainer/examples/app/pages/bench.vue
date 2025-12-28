<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useWebContainer } from "~/composables/useWebContainer";

const { containers, loading, error, fetchContainers } = useWebContainer();

const refreshAt = ref<number | null>(null);

const containerCount = computed(() => containers.value.length);

async function refresh() {
	await fetchContainers();
	refreshAt.value = Date.now();
}

onMounted(() => {
	refresh();
});
</script>

<template>
	<div class="page">
		<header class="header">
			<div class="title">
				<NuxtLink to="/" class="back">Back</NuxtLink>
				<h1>Bench Viewer</h1>
			</div>
			<div class="actions">
				<button type="button" class="btn" @click="refresh" :disabled="loading" aria-label="Refresh containers">
					Refresh
				</button>
			</div>
		</header>

		<p class="sub">
			Containers: <strong>{{ containerCount }}</strong>
			<span v-if="refreshAt" class="muted">(updated {{ new Date(refreshAt).toLocaleTimeString() }})</span>
		</p>

		<div v-if="error" class="banner" role="alert">{{ error }}</div>

		<section class="card">
			<div class="card-head">
				<h2>Raw Data</h2>
				<p class="muted">Useful for debugging API output and container state.</p>
			</div>
			<pre class="json" aria-label="Containers JSON">{{ JSON.stringify(containers, null, 2) }}</pre>
		</section>
	</div>
</template>

<style scoped>
.page {
	min-height: 100vh;
	background: #0a0a0a;
	color: #fff;
	padding: 1.5rem;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding-bottom: 1rem;
	border-bottom: 1px solid #222;
}

.title {
	display: flex;
	align-items: baseline;
	gap: 1rem;
}

.back {
	color: #9bbcff;
	text-decoration: none;
	border: 1px solid #2a2a2a;
	padding: 0.4rem 0.75rem;
	border-radius: 8px;
}

.back:focus-visible {
	outline: 2px solid #4a9eff;
	outline-offset: 2px;
}

.actions {
	display: flex;
	gap: 0.5rem;
}

.btn {
	padding: 0.6rem 1rem;
	background: #222;
	border: 1px solid #333;
	color: white;
	border-radius: 10px;
	cursor: pointer;
}

.btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.btn:focus-visible {
	outline: 2px solid #4a9eff;
	outline-offset: 2px;
}

.sub {
	margin: 1rem 0;
	color: #ddd;
}

.muted {
	color: #999;
}

.banner {
	padding: 0.75rem 1rem;
	background: #ff4444;
	border-radius: 10px;
	margin-bottom: 1rem;
}

.card {
	border: 1px solid #222;
	border-radius: 14px;
	background: #111;
	overflow: hidden;
}

.card-head {
	padding: 1rem 1rem 0.5rem;
}

.json {
	margin: 0;
	padding: 1rem;
	background: #000;
	overflow: auto;
	max-height: 70vh;
	font-size: 0.875rem;
	border-top: 1px solid #222;
}

@media (max-width: 640px) {
	.page {
		padding: 1rem;
	}

	.title {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;
	}
}
</style>
