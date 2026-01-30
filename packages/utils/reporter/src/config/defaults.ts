import type { ReporterConfig } from "./types";

export const DEFAULT_CONFIG: ReporterConfig = {
	format: "text",
	severity: {
		minLevel: "warning",
		exitCode: {
			error: 1,
			warning: 1,
			info: 0,
			hint: 0,
		},
	},
	filters: {
		include: {},
		exclude: {},
	},
	rules: {
		enabled: true,
		rules: {},
	},
	output: {
		colors: true,
		icons: true,
		groupBy: "file",
		showSummary: true,
		showStats: true,
	},
};
