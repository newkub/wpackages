import path from "node:path";
import pc from "picocolors";
import type { AnalysisResult, AnyAnalysisResult, WorkspaceAnalysisResult } from "../types/report";

function isWorkspaceResult(result: AnyAnalysisResult): result is WorkspaceAnalysisResult {
	return (result as WorkspaceAnalysisResult).mode === "workspace";
}

function countIssues(result: AnalysisResult): number {
	const unusedExportCount = [...result.unusedExports.values()].reduce((acc, v) => acc + v.length, 0);
	return result.unusedFiles.length + result.unusedDependencies.length + unusedExportCount;
}

export function formatTextReport(result: AnyAnalysisResult, cwd: string): number {
	let issueCount = 0;

	const renderText = (single: AnalysisResult, rootCwd: string) => {
		if (single.unusedFiles.length > 0) {
			console.log(pc.yellow("\n--- Unused Files ---"));
			single.unusedFiles.forEach((file: string) => {
				console.log(`  ${path.relative(rootCwd, file)}`);
				issueCount++;
			});
		}

		if (single.unusedDependencies.length > 0) {
			console.log(pc.yellow("\n--- Unused Dependencies ---"));
			single.unusedDependencies.forEach((dep: string) => {
				console.log(`  ${dep}`);
				issueCount++;
			});
		}

		if (single.unusedExports.size > 0) {
			console.log(pc.yellow("\n--- Unused Exports ---"));
			for (const [filePath, exports] of single.unusedExports.entries()) {
				console.log(`  ${path.relative(rootCwd, filePath)}`);
				exports.forEach((exp: string) => {
					console.log(`    - ${exp}`);
					issueCount++;
				});
			}
		}
	};

	if (isWorkspaceResult(result)) {
		let total = 0;
		for (const pkg of result.packages) {
			console.log(pc.cyan(`\n=== ${pkg.packageName} (${pkg.cwd}) ===`));
			const pkgIssues = countIssues(pkg);
			total += pkgIssues;
			renderText(pkg, pkg.cwd);
		}
		issueCount = total;
	} else {
		renderText(result, cwd);
	}

	if (issueCount === 0) {
		console.log(pc.green("\n✨ No unused files, dependencies, or exports found. Your project is clean!"));
	} else {
		console.log(pc.yellow(`\nFound ${issueCount} total issues.`));
	}

	return issueCount;
}
