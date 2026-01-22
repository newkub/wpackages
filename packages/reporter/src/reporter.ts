import fs from "node:fs/promises";
import { toJsonReport, toWorkspaceJsonReport } from "./formatters/json-formatter";
import { toSarifReport } from "./formatters/sarif-formatter";
import { formatTextReport } from "./formatters/text-formatter";
import type { AnyAnalysisResult, ReportFormat, ReportOptions } from "./types/report";

function isWorkspaceResult(result: AnyAnalysisResult): result is import("./types/report").WorkspaceAnalysisResult {
	return (result as import("./types/report").WorkspaceAnalysisResult).mode === "workspace";
}

export async function report(result: AnyAnalysisResult, options: ReportOptions): Promise<number> {
	const cwd = options.cwd;
	const format = options.format ?? "text";
	let issueCount = 0;

	const writeOutput = async (content: string) => {
		if (options.outputFile) {
			await fs.writeFile(options.outputFile, content, "utf-8");
		} else {
			console.log(content);
		}
	};

	if (format === "sarif") {
		const sarif = JSON.stringify(toSarifReport(result, cwd), null, 2);
		await writeOutput(sarif);
		issueCount = isWorkspaceResult(result)
			? toWorkspaceJsonReport(result).summary.issues
			: toJsonReport(result, cwd).summary.issues;
	} else if (format === "json") {
		if (isWorkspaceResult(result)) {
			const json = JSON.stringify(toWorkspaceJsonReport(result), null, 2);
			await writeOutput(json);
			issueCount = toWorkspaceJsonReport(result).summary.issues;
		} else {
			const json = JSON.stringify(toJsonReport(result, cwd), null, 2);
			await writeOutput(json);
			issueCount = toJsonReport(result, cwd).summary.issues;
		}
	} else {
		issueCount = formatTextReport(result, cwd);
	}

	return issueCount > 0 ? 1 : 0;
}

export type { ReportFormat, ReportOptions } from "./types/report";
export type * from "./types/report";
