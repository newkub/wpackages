import { SearchEngineProgressEvent } from "../services/search.service";

export type SearchWorkflowEvent =
	| { type: "workflow:start"; at: string; query: string }
	| { type: "workflow:stage:start"; at: string; stage: "enhance" | "search" | "summarize" | "cluster" }
	| {
		type: "workflow:stage:success";
		at: string;
		stage: "enhance" | "search" | "summarize" | "cluster";
		durationMs: number;
	}
	| {
		type: "workflow:stage:error";
		at: string;
		stage: "enhance" | "search" | "summarize" | "cluster";
		durationMs: number;
		error: string;
	}
	| { type: "workflow:complete"; at: string; durationMs: number }
	| { type: "workflow:error"; at: string; durationMs: number; error: string }
	| SearchEngineProgressEvent;
