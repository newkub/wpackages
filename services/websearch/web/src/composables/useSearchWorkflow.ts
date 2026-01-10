import { computed, nextTick, onBeforeUnmount, ref } from "vue";
import type { FinalPayload, Stage, StepStatus, StreamEvent } from "../lib/types";
import { createMockStream } from "../lib/mock";

const stageOrder: Stage[] = ["enhance", "search", "summarize", "cluster"];

const stageLabel = (s: Stage) => {
	switch (s) {
		case "enhance":
			return "Planning";
		case "search":
			return "Searching";
		case "summarize":
			return "Summarizing";
		case "cluster":
			return "Clustering";
	}
};

const initStageStatus = (): Record<Stage, StepStatus> => ({
	enhance: "idle",
	search: "idle",
	summarize: "idle",
	cluster: "idle",
});

export const useSearchWorkflow = () => {
	const q = ref("Samsung Galaxy flagship 2025");
	const isRunning = ref(false);
	const events = ref<StreamEvent[]>([]);
	const result = ref<FinalPayload | null>(null);
	const lastError = ref<string | null>(null);
	const currentStage = ref<Stage | null>(null);
	const stageStatus = ref<Record<Stage, StepStatus>>(initStageStatus());

	let es: EventSource | null = null;
	let stopMock: (() => void) | null = null;

	const apiBase = computed(() => {
		const raw = import.meta.env.VITE_API_BASE_URL;
		return typeof raw === "string" ? raw.trim().replace(/\/$/, "") : "";
	});

	const useRealBackend = computed(() => {
		return String(import.meta.env.VITE_USE_REAL_BACKEND ?? "").toLowerCase() === "true";
	});

	const reset = () => {
		events.value = [];
		result.value = null;
		lastError.value = null;
		currentStage.value = null;
		stageStatus.value = initStageStatus();
	};

	const stop = () => {
		if (es) {
			es.close();
			es = null;
		}
		if (stopMock) {
			stopMock();
			stopMock = null;
		}
		isRunning.value = false;
	};

	const onEvent = (data: StreamEvent) => {
		events.value.push(data);

		if (data.type === "error") {
			lastError.value = data.error;
			for (const stage of stageOrder) {
				if (stageStatus.value[stage] === "active") stageStatus.value[stage] = "error";
			}
			stop();
			return;
		}

		if (data.type === "workflow:stage:start") {
			currentStage.value = data.stage;
			stageStatus.value[data.stage] = "active";
			return;
		}

		if (data.type === "workflow:stage:success") {
			stageStatus.value[data.stage] = "success";
			return;
		}

		if (data.type === "workflow:stage:error") {
			stageStatus.value[data.stage] = "error";
			lastError.value = data.error;
			return;
		}

		if (data.type === "result") {
			result.value = (data.payload ?? null) as FinalPayload | null;
			stop();
			return;
		}
	};

	const startMock = async () => {
		const query = q.value.trim();
		if (!query) {
			lastError.value = "กรุณาใส่คำค้น";
			return;
		}

		isRunning.value = true;
		await nextTick();

		const stream = createMockStream(query);
		stopMock = stream.stop;
		stream.start(onEvent);
	};

	const startSSE = async () => {
		const query = q.value.trim();
		if (!query) {
			lastError.value = "กรุณาใส่คำค้น";
			return;
		}

		isRunning.value = true;
		await nextTick();

		const url = `${apiBase.value}/api/search/stream?q=${encodeURIComponent(query)}`;
		es = new EventSource(url);

		es.onmessage = (msg) => {
			const data: StreamEvent = JSON.parse(msg.data);
			onEvent(data);
		};

		es.onerror = () => {
			lastError.value = "การเชื่อมต่อหลุด (SSE error)";
			stop();
			reset();
			void startMock();
		};
	};

	const start = async () => {
		stop();
		reset();

		if (useRealBackend.value && apiBase.value) {
			await startSSE();
			return;
		}

		await startMock();
	};

	onBeforeUnmount(() => {
		stop();
	});

	const steps = computed(() => {
		return stageOrder.map((id) => ({
			id,
			label: stageLabel(id),
			status: stageStatus.value[id],
		}));
	});

	const resultsList = computed(() => {
		const items = result.value?.results;
		return Array.isArray(items) ? items : [];
	});

	const runningLabel = computed(() => {
		return isRunning.value ? "Running…" : "Idle";
	});

	return {
		q,
		isRunning,
		events,
		result,
		lastError,
		currentStage,
		stageStatus,
		steps,
		resultsList,
		runningLabel,
		start,
		stop,
	};
};
