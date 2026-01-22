import type { ReportFormat } from "../types/report";

export type SeverityLevel = "error" | "warning" | "info" | "hint";

export interface SeverityConfig {
	minLevel?: SeverityLevel;
	exitCode?: {
		error?: number;
		warning?: number;
		info?: number;
		hint?: number;
	};
}

export interface FilterConfig {
	include?: {
		files?: string[];
		rules?: string[];
		severity?: SeverityLevel[];
	};
	exclude?: {
		files?: string[];
		rules?: string[];
		severity?: SeverityLevel[];
	};
}

export interface RuleConfig {
	enabled?: boolean;
	rules?: Record<string, {
		enabled?: boolean;
		severity?: SeverityLevel;
		options?: Record<string, unknown>;
	}>;
}

export interface OutputConfig {
	colors?: boolean;
	icons?: boolean;
	groupBy?: "file" | "rule" | "severity" | "none";
	showSummary?: boolean;
	showStats?: boolean;
}

export interface ReporterConfig {
	format?: ReportFormat;
	outputFile?: string;
	cwd?: string;
	severity?: SeverityConfig;
	filters?: FilterConfig;
	rules?: RuleConfig;
	output?: OutputConfig;
	extends?: string | string[];
}

export interface ConfigLoadOptions {
	cwd?: string;
	configPath?: string;
}

export interface ConfigLoadResult {
	config: ReporterConfig;
	configPath: string | null;
}
