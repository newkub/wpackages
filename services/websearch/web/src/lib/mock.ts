import type { FinalPayload, StreamEvent } from "./types";

const now = () => new Date().toISOString();

const sleep = (ms: number, signal: { cancelled: boolean }) => {
	return new Promise<void>((resolve) => {
		const t = setTimeout(() => resolve(), ms);
		if (signal.cancelled) {
			clearTimeout(t);
			resolve();
		}
	});
};

const createMockPayload = (query: string): FinalPayload => {
	return {
		query,
		results: [
			{
				title: `Searching "${query}": best comparisons and prices`,
				url: "https://www.gsmarena.com/",
				snippet: `Compare the latest devices related to ${query} — specs, release windows, and expected prices.`,
				engine: "mock",
				score: 0.86,
			},
			{
				title: `Latest news about ${query} (mock result)`,
				url: "https://www.theverge.com/",
				snippet:
					"Mock snippet: This simulates a realistic search list item with a favicon, URL, and highlighted keywords.",
				engine: "mock",
				score: 0.78,
			},
			{
				title: `${query} — overview & timeline`,
				url: "https://en.wikipedia.org/wiki/Samsung_Galaxy",
				snippet:
					"Mock snippet: Timeline and context for the query. Use this to verify scroll behavior and typography.",
				engine: "mock",
				score: 0.74,
			},
		],
		summary: {
			summary:
				"Mock summary: Simulated workflow (planning → searching → summarizing → clustering). Switch to real backend via VITE_USE_REAL_BACKEND=true.",
			keyPoints: [
				"Timeline on the left updates step-by-step.",
				"Results list on the right is scrollable and highlights query terms.",
				"Mock mode makes the UI demoable without backend.",
			],
		},
		clusters: [{ name: "Comparisons" }, { name: "Prices" }, { name: "Specs" }],
	};
};

export const createMockStream = (query: string) => {
	const signal = { cancelled: false };

	const stop = () => {
		signal.cancelled = true;
	};

	const start = async (emit: (evt: StreamEvent) => void) => {
		emit({ type: "workflow:start", at: now(), query });

		emit({ type: "workflow:stage:start", at: now(), stage: "enhance" });
		await sleep(420, signal);
		emit({ type: "workflow:stage:success", at: now(), stage: "enhance", durationMs: 420 });

		emit({ type: "workflow:stage:start", at: now(), stage: "search" });
		await sleep(520, signal);
		emit({ type: "engine:start", at: now(), engine: "duckduckgo" });
		await sleep(260, signal);
		emit({ type: "engine:success", at: now(), engine: "duckduckgo", resultsCount: 7, durationMs: 260 });
		await sleep(180, signal);
		emit({ type: "engine:start", at: now(), engine: "brave" });
		await sleep(320, signal);
		emit({ type: "engine:success", at: now(), engine: "brave", resultsCount: 6, durationMs: 320 });
		await sleep(160, signal);
		emit({ type: "workflow:stage:success", at: now(), stage: "search", durationMs: 1440 });

		emit({ type: "workflow:stage:start", at: now(), stage: "summarize" });
		await sleep(520, signal);
		emit({ type: "workflow:stage:success", at: now(), stage: "summarize", durationMs: 520 });

		emit({ type: "workflow:stage:start", at: now(), stage: "cluster" });
		await sleep(420, signal);
		emit({ type: "workflow:stage:success", at: now(), stage: "cluster", durationMs: 420 });

		emit({ type: "workflow:complete", at: now(), durationMs: 2800 });

		await sleep(260, signal);
		emit({ type: "result", at: now(), payload: createMockPayload(query) });
	};

	return { start, stop };
};
