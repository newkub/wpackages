export type ReportFormat = "text" | "json" | "sarif";

export interface ReportOptions {
	cwd: string;
	format?: ReportFormat;
	outputFile?: string;
}

export interface JsonReport {
	cwd: string;
	summary: {
		issues: number;
		unusedFiles: number;
		unusedDependencies: number;
		unusedExports: number;
	};
	unusedFiles: string[];
	unusedDependencies: string[];
	unusedExports: Record<string, string[]>;
}

export interface WorkspaceJsonReport {
	mode: "workspace";
	root: string;
	summary: {
		issues: number;
		unusedFiles: number;
		unusedDependencies: number;
		unusedExports: number;
	};
	packages: Array<{
		packageName: string;
		cwd: string;
		report: JsonReport;
	}>;
}

export interface AnalysisResult {
	unusedFiles: string[];
	unusedDependencies: Set<string>;
	unusedExports: Map<string, string[]>;
}

export interface PackageAnalysisResult extends AnalysisResult {
	packageName: string;
	cwd: string;
}

export interface WorkspaceAnalysisResult {
	mode: "workspace";
	root: string;
	packages: PackageAnalysisResult[];
}

export type AnyAnalysisResult = AnalysisResult | WorkspaceAnalysisResult;

export interface SarifLog {
	$schema: string;
	version: "2.1.0";
	runs: SarifRun[];
}

export interface SarifRun {
	tool: {
		driver: {
			name: string;
			informationUri?: string;
			rules: SarifRule[];
		};
	};
	results: SarifResult[];
}

export interface SarifRule {
	id: string;
	name: string;
	shortDescription: { text: string };
	helpUri?: string;
}

export interface SarifResult {
	ruleId: string;
	level: "error" | "warning" | "note";
	message: { text: string };
	locations?: Array<{
		physicalLocation: {
			artifactLocation: { uri: string };
		};
	}>;
	properties?: Record<string, unknown>;
}
