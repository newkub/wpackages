import chalk from "chalk";
import type { FileInfo } from "../types/analyzer";

// This is a placeholder for a more sophisticated formatter with shiki
export function formatTypeAnalysis(fileInfos: FileInfo[]): string {
	let output = "";
	for (const fileInfo of fileInfos) {
		if (fileInfo.variables.length === 0) continue;

		for (const variable of fileInfo.variables) {
			output += `\n${chalk.gray("📄")} ${chalk.underline(`${fileInfo.path}:${variable.line}`)}\n`;

			const kindAndName = `${chalk.bold(variable.kind)} ${chalk.cyan.bold("➔")} ${chalk.bold(variable.name)}`;
			output += `${kindAndName}\n`;
			output += `${chalk.gray("─".repeat(50))}\n`;
			output += `${variable.code}\n`; // Simplified output without syntax highlighting
		}
	}
	return output;
}
