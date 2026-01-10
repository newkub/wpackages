<script setup lang="ts">
import type { Stage, StepStatus } from "../lib/types";

type Step = {
	id: Stage;
	label: string;
	status: StepStatus;
};

defineProps<{
	steps: Step[];
}>();

const dotClass = (status: StepStatus) => {
	switch (status) {
		case "idle":
			return "w-12px h-12px rd-full border-2 border-white/18 bg-white/10";
		case "active":
			return "w-12px h-12px rd-full border-2 border-run/65 bg-run shadow-[0_0_0_6px_rgba(96,165,250,0.10)] animate-pulse";
		case "success":
			return "w-12px h-12px rd-full border-2 border-ok/65 bg-ok";
		case "error":
			return "w-12px h-12px rd-full border-2 border-err/65 bg-err";
	}
};
</script>

<template>
	<div class="flex flex-col gap-2.5 px-0.5 pb-1.5">
		<div v-for="(s, idx) in steps" :key="s.id" class="grid grid-cols-[18px_1fr] gap-3 items-start">
			<div class="relative flex flex-col items-center">
				<div :class="dotClass(s.status)" />
				<div
					v-if="idx < steps.length - 1"
					class="w-2px flex-1 min-h-26px bg-white/12 mt-2 rd-full"
				/>
			</div>
			<div class="pt-0.5">
				<div class="text-13px font-650 text-white/92 leading-1.25">{{ s.label }}</div>
				<div class="mt-0.75 text-12px text-white/46">{{ s.id }}</div>
			</div>
		</div>
	</div>
</template>
