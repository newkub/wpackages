export type Stage = "understanding" | "planning" | "searching" | "summarizing" | "clustering";

export type StepStatus = "idle" | "active" | "success" | "error";

export type WorkflowEvent =
	| { type: "workflow:start"; at: string; query: string }
	| { type: "workflow:stage:start"; at: string; stage: Stage }
	| { type: "workflow:stage:success"; at: string; stage: Stage; durationMs: number }
	| { type: "workflow:stage:error"; at: string; stage: Stage; durationMs: number; error: string }
	| { type: "workflow:complete"; at: string; durationMs: number }
	| { type: "workflow:error"; at: string; durationMs: number; error: string }
	| { type: "engine:start"; engine: string; at: string }
	| { type: "engine:success"; engine: string; at: string; resultsCount: number; durationMs: number }
	| { type: "engine:error"; engine: string; at: string; error: string; durationMs: number };

export type StreamEvent = WorkflowEvent | { type: "result"; at: string; payload: unknown } | { type: "error"; at: string; error: string } | { type: "ping"; at: string };

export type SearchResultItem = {
	title: string;
	url: string;
	snippet?: string;
	engine?: string;
	score?: number;
};

export type FinalPayload = {
	query?: string;
	results?: SearchResultItem[];
	summary?: { summary?: string; keyPoints?: string[] };
	clusters?: Array<{ name?: string; topic?: string }>;
};
