<script setup lang="ts">
import type { SearchResultItem } from "../lib/types";
import { faviconUrl, highlight, safeUrlHost } from "../lib/text";

defineProps<{
	query: string;
	items: SearchResultItem[];
}>();
</script>

<template>
	<div class="space-y-2.5">
		<a
			v-for="(r, idx) in items"
			:key="idx"
			class="grid grid-cols-[18px_1fr] gap-2.5 p-3 rd-3.5 border border-white/10 bg-black/22 hover:bg-white/7 transition-colors"
			:href="r.url"
			target="_blank"
			rel="noreferrer"
		>
			<img class="w-18px h-18px rd-6px bg-white/8" :src="faviconUrl(r.url)" alt="" />
			<div>
				<div class="font-650 text-14px leading-1.35" v-html="highlight(r.title, query)" />
				<div class="mt-1 text-12px text-run/92 break-all">{{ safeUrlHost(r.url) }}</div>
				<div
					v-if="r.snippet"
					class="mt-2 text-12px leading-1.6 text-white/78"
					v-html="highlight(r.snippet, query)"
				/>
			</div>
		</a>
	</div>
</template>
