<script setup lang="ts">
import SearchResults from "./components/SearchResults.vue";
import StepsTimeline from "./components/StepsTimeline.vue";
import { useSearchWorkflow } from "./composables/useSearchWorkflow";

const { q, isRunning, lastError, steps, resultsList, runningLabel, start, stop } = useSearchWorkflow();
</script>

<template>
	<div class="min-h-screen bg-[radial-gradient(1200px_700px_at_20%_0%,rgba(255,138,61,0.12),transparent),radial-gradient(1000px_700px_at_85%_20%,rgba(96,165,250,0.12),transparent),#0b1220] text-text">
		<header class="sticky top-0 z-10 backdrop-blur bg-bg/72 border-b border-border">
			<div class="max-w-1150px mx-auto px-4.5 py-3.5 flex items-center justify-between gap-3">
				<div class="min-w-0">
					<div class="text-12px text-muted">@wpackages</div>
					<div class="text-15px font-800 tracking-0.2px truncate">Websearch</div>
				</div>
				<div class="flex items-center gap-2">
					<button class="btn" :disabled="isRunning" @click="start">Search</button>
					<button class="btn" :disabled="!isRunning" @click="stop">Stop</button>
				</div>
			</div>
		</header>

		<main class="max-w-1150px mx-auto px-4.5 py-4.5 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
			<section class="panel">
				<div class="panel-header">
					<div class="panel-title">Workflow</div>
					<div class="muted">{{ runningLabel }}</div>
				</div>
				<div class="p-3.5">
					<div class="mb-3">
						<div class="muted mb-2">Search query</div>
						<input class="input" v-model="q" :disabled="isRunning" @keyup.enter="start" />
						<div class="muted mt-1.5">Enter เพื่อค้นหา</div>
					</div>

					<StepsTimeline :steps="steps" />

					<div v-if="lastError" class="panel mt-3 border-(1 solid err/35)">
						<div class="p-3.5">
							<div class="text-13px font-800 text-err">Error</div>
							<div class="muted mt-1.5">{{ lastError }}</div>
						</div>
					</div>
				</div>
			</section>

			<section class="panel grid grid-rows-[auto_1fr] min-h-520px">
				<div class="panel-header">
					<div class="panel-title">Results</div>
					<div class="muted">{{ resultsList.length }} items</div>
				</div>
				<div class="overflow-auto max-h-[calc(100vh-170px)] p-3">
					<SearchResults v-if="resultsList.length" :items="resultsList" :query="q" />
					<div v-else class="muted">Waiting for results…</div>
				</div>
			</section>
		</main>
	</div>
</template>
