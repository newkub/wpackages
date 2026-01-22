import path from "node:path";
import type { AnalysisResult, JsonReport, PackageAnalysisResult, WorkspaceAnalysisResult } from "../types/report";

function countExportIssues(unusedExports: Record<string, string[]>): number {
	return Object.values(unusedExports).reduce((acc, v) => acc + v.length, 0);
}

export function toJsonReport(result: AnalysisResult, cwd: string): JsonReport {
	const unusedFiles = result.unusedFiles.map(file => path.relative(cwd, file));
	const unusedDependencies = [...result.unusedDependencies];
	const unusedExports: Record<string, string[]> = Object.fromEntries(result.unusedExports.entries());
	const unusedExportCount = countExportIssues(unusedExports);

	return {
		cwd,
		summary: {
			issues: unusedFiles.length + unusedDependencies.length + unusedExportCount,
			unusedFiles: unusedFiles.length,
			unusedDependencies: unusedDependencies.length,
			unusedExports: unusedExportCount,
		},
		unusedFiles,
		unusedDependencies,
		unusedExports,
	};
}

export function toWorkspaceJsonReport(result: WorkspaceAnalysisResult): WorkspaceJsonReport {
	const packages = result.packages.map((p: PackageAnalysisResult) => ({
		packageName: p.packageName,
		cwd: p.cwd,
		report: toJsonReport(p, p.cwd),
	}));

	const summary = packages.reduce(
		(acc, p) => {
			acc.issues += p.report.summary.issues;
			acc.unusedFiles += p.report.summary.unusedFiles;
			acc.unusedDependencies += p.report.summary.unusedDependencies;
			acc.unusedExports += p.report.summary.unusedExports;
			return acc;
		},
		{ issues: 0, unusedFiles: 0, unusedDependencies: 0, unusedExports: 0 },
	);

	return {
		mode: "workspace",
		root: result.root,
		summary,
		packages,
	};
}
