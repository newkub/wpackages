import * as pc from "picocolors";
import { COLORS, SYMBOLS } from "../constant/cli.const";
import type { BenchComparison, BenchmarkResult, BenchResult, BenchSuite, ComparisonResult } from "../types/index";
import { formatBytes, formatOps, formatPercentage, formatTime } from "./stats-formatters";

const SEPARATOR_WIDTH = 60;
const CHART_BAR_WIDTH = 50;
const TABLE_COL_WIDTHS = [30, 12, 12, 12, 12, 10] as const;

const sortByMean = (comparison: ComparisonResult): BenchmarkResult[] => {
	return [...comparison.results].sort((a, b) => a.mean - b.mean);
};

const formatTableRow = (
	row: readonly string[],
	widths: readonly number[],
	isHeader = false,
): string => {
	const formatted = row.map((cell, i) => cell.padEnd(widths[i] ?? 0)).join(" ");
	return isHeader ? `${COLORS.bold(formatted)}\n` : `${formatted}\n`;
};

/**
 * Format benchmark result (CLI version)
 */
export const formatBenchmarkResult = (result: BenchmarkResult): string => {
	let output = `\n${pc.bold(result.command)}\n`;
	output += `${pc.dim("─".repeat(SEPARATOR_WIDTH))}\n`;
	output += `  Runs: ${result.runs}\n`;
	output += `  Throughput: ${pc.cyan(formatOps(result.throughputOpsPerSec))}\n`;
	output += `  Error rate: ${formatPercentage(result.errorRate)} (${result.errorCount}/${result.runs})\n`;
	output += `  CPU: ${formatTime(result.cpuUserMs)} user / ${formatTime(result.cpuSystemMs)} system\n`;
	output += `  Memory (max RSS): ${formatBytes(result.maxRssBytes)}\n`;
	output += `  FS I/O: ${formatBytes(result.fsReadBytes)} read / ${formatBytes(result.fsWriteBytes)} write\n`;
	output += `  Mean: ${pc.cyan(formatTime(result.mean))} ± ${formatTime(result.stddev)}\n`;
	output += `  Median: ${formatTime(result.median)}\n`;
	output += `  Range: ${formatTime(result.min)} ... ${formatTime(result.max)}\n`;
	output += `  Percentiles:\n`;
	output += `    25th: ${formatTime(result.percentiles.p25)}\n`;
	output += `    50th: ${formatTime(result.percentiles.p50)}\n`;
	output += `    75th: ${formatTime(result.percentiles.p75)}\n`;
	output += `    90th: ${formatTime(result.percentiles.p90)}\n`;
	output += `    95th: ${formatTime(result.percentiles.p95)}\n`;
	output += `    99th: ${formatTime(result.percentiles.p99)}\n`;
	return output;
};

export const formatComparison = (comparison: ComparisonResult): string => {
	let output = `\n${COLORS.bold("Benchmark Comparison")}\n`;
	output += `${COLORS.dim("─".repeat(SEPARATOR_WIDTH))}\n\n`;

	const sorted = sortByMean(comparison);

	for (const result of sorted) {
		const speedup = comparison.speedups[result.command];
		const isFastest = result.command === comparison.fastest;
		const isSlowest = result.command === comparison.slowest;

		const symbol = isFastest
			? SYMBOLS.fastest
			: isSlowest
			? SYMBOLS.slowest
			: " ";
		const color = isFastest
			? COLORS.fastest
			: isSlowest
			? COLORS.slowest
			: COLORS.muted;

		output += `${symbol} ${color(result.command)}\n`;
		output += `  ${formatTime(result.mean)} ± ${formatTime(result.stddev)}`;

		if (!isFastest && speedup !== undefined) {
			output += ` ${COLORS.dim(`(${speedup.toFixed(2)}x slower)`)}`;
		} else {
			output += ` ${COLORS.success("(fastest)")}`;
		}

		output += "\n\n";
	}

	return output;
};

export const formatTable = (comparison: ComparisonResult): string => {
	const headers = ["Command", "Mean", "StdDev", "Min", "Max", "Speedup"];
	const colWidths = TABLE_COL_WIDTHS;

	let output = "\n";
	output += formatTableRow(headers, colWidths, true);
	output += `${COLORS.dim("─".repeat(colWidths.reduce((a, b) => a + b, 0) + headers.length + 1))}\n`;

	const sorted = sortByMean(comparison);

	for (const result of sorted) {
		const speedup = comparison.speedups[result.command];
		const isFastest = result.command === comparison.fastest;

		const row = [
			result.command.substring(0, 28),
			formatTime(result.mean),
			formatTime(result.stddev),
			formatTime(result.min),
			formatTime(result.max),
			isFastest ? "baseline" : speedup !== undefined ? `${speedup.toFixed(2)}x` : "N/A",
		];

		output += formatTableRow(row, colWidths);
	}

	return output;
};

export const formatJson = (comparison: ComparisonResult): string => {
	return JSON.stringify(comparison, null, 2);
};

export const formatChart = (comparison: ComparisonResult): string => {
	const maxMean = Math.max(...comparison.results.map((r) => r.mean));
	const barWidth = CHART_BAR_WIDTH;

	let output = `\n${pc.bold("Performance Chart")}\n`;
	output += `${pc.dim("─".repeat(SEPARATOR_WIDTH))}\n\n`;

	const sorted = sortByMean(comparison);

	for (const result of sorted) {
		const barLength = Math.round((result.mean / maxMean) * barWidth);
		const bar = "█".repeat(barLength);
		const isFastest = result.command === comparison.fastest;
		const color = isFastest ? pc.green : pc.blue;

		output += `${result.command}\n`;
		output += `${color(bar)} ${formatTime(result.mean)}\n\n`;
	}

	return output;
};

export type ComparisonFormat = "default" | "table" | "json" | "chart";

const formatterMap: Record<Exclude<ComparisonFormat, "default">, (comparison: ComparisonResult) => string> = {
	table: formatTable,
	json: formatJson,
	chart: formatChart,
} as const;

const selectFormatter = (format: ComparisonFormat): (comparison: ComparisonResult) => string => {
	if (format === "default") return formatComparison;
	return formatterMap[format];
};

/**
 * Master formatter for benchmark comparisons
 * @param comparison - The comparison result object
 * @param format - The desired output format
 * @returns The formatted string
 */
export const formatComparisonResult = (
	comparison: ComparisonResult,
	format: ComparisonFormat = "default",
): string => {
	const formatter = selectFormatter(format);
	return formatter(comparison);
};

/**
 * Format benchmark result (bench-lib version)
 */
export const formatBenchResult = (result: BenchResult): string => {
	const lines: string[] = [];

	lines.push(pc.bold(result.name));
	lines.push(`  ${pc.dim("Iterations:")} ${result.iterations}`);
	lines.push(`  ${pc.dim("Samples:")} ${result.samples}`);
	lines.push(
		`  ${pc.dim("Total time:")} ${formatTime(result.totalTime)}`,
	);
	lines.push(
		`  ${pc.dim("Average:")} ${formatTime(result.averageTime)} ${
			pc.dim(`±${formatPercentage(result.stats.relativeMarginOfError)}`)
		}`,
	);
	lines.push(`  ${pc.dim("Ops/sec:")} ${pc.cyan(formatOps(result.ops))}`);
	lines.push(
		`  ${pc.dim("Min:")} ${formatTime(result.stats.min)} ${pc.dim("|")} ${pc.dim("Max:")} ${
			formatTime(result.stats.max)
		}`,
	);
	lines.push(
		`  ${pc.dim("Median:")} ${formatTime(result.stats.median)} ${pc.dim("|")} ${pc.dim("StdDev:")} ${
			formatTime(result.stats.standardDeviation)
		}`,
	);

	return lines.join("\n");
};

/**
 * Format comparison (bench-lib version)
 */
export const formatBenchComparison = (comparison: BenchComparison): string => {
	const lines: string[] = [];

	lines.push(pc.bold("\nComparison:"));
	lines.push(
		`  🚀 Fastest: ${pc.green(comparison.fastest)}`,
	);
	lines.push(
		`  🐌 Slowest: ${pc.red(comparison.slowest)}`,
	);
	lines.push("");

	const sorted = [...comparison.results].sort(
		(a, b) => a.relativeTo - b.relativeTo,
	);

	for (const item of sorted) {
		const color = item.relativeTo === 1 ? pc.green : pc.yellow;
		const diff = item.percentage === 0
			? "baseline"
			: item.percentage > 0
			? `+${formatPercentage(item.percentage)}`
			: formatPercentage(item.percentage);

		lines.push(
			`  ${color(item.name)}: ${pc.dim(item.ratio)} ${pc.dim(`(${diff})`)}`,
		);
	}

	return lines.join("\n");
};

/**
 * Format suite
 */
export const formatSuite = (suite: BenchSuite): string => {
	const lines: string[] = [];

	lines.push(pc.bold(pc.cyan(`\n${suite.name}`)));
	lines.push(pc.dim(`Created: ${suite.createdAt.toISOString().split("T")[0]}`));
	lines.push(pc.dim(`Total time: ${formatTime(suite.totalTime)}`));
	lines.push(pc.dim(`Benchmarks: ${suite.benchmarks.length}`));
	lines.push("");

	for (const bench of suite.benchmarks) {
		lines.push(formatBenchResult(bench));
		lines.push("");
	}

	return lines.join("\n");
};

/**
 * Format as JSON
 */
export const formatJSON = (data: unknown, pretty: boolean = true): string => {
	return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
};

/**
 * Format as markdown table
 */
export const formatMarkdownTable = (
	results: readonly BenchResult[],
): string => {
	const lines: string[] = [];

	lines.push("| Name | Ops/sec | Average | Min | Max | StdDev |");
	lines.push("|------|---------|---------|-----|-----|--------|");

	for (const result of results) {
		lines.push(
			`| ${result.name} | ${formatOps(result.ops)} | ${formatTime(result.averageTime)} | ${
				formatTime(result.stats.min)
			} | ${formatTime(result.stats.max)} | ${formatTime(result.stats.standardDeviation)} |`,
		);
	}

	return lines.join("\n");
};

/**
 * Format as CSV
 */
export const formatCSV = (results: readonly BenchResult[]): string => {
	const lines: string[] = [];

	lines.push(
		"Name,Iterations,Samples,Total Time (ms),Average (ms),Ops/sec,Min (ms),Max (ms),Median (ms),StdDev (ms),Variance,Margin of Error (ms),Relative Margin of Error (%)",
	);

	for (const result of results) {
		lines.push(
			[
				result.name,
				result.iterations,
				result.samples,
				result.totalTime,
				result.averageTime,
				result.ops,
				result.stats.min,
				result.stats.max,
				result.stats.median,
				result.stats.standardDeviation,
				result.stats.variance,
				result.stats.marginOfError,
				result.stats.relativeMarginOfError,
			].join(","),
		);
	}

	return lines.join("\n");
};

/**
 * Format as HTML table
 */
export const formatHTMLTable = (results: readonly BenchResult[]): string => {
	const rows = results
		.map(
			(result) => `
    <tr>
      <td>${result.name}</td>
      <td>${formatOps(result.ops)}</td>
      <td>${formatTime(result.averageTime)}</td>
      <td>${formatTime(result.stats.min)}</td>
      <td>${formatTime(result.stats.max)}</td>
      <td>${formatTime(result.stats.standardDeviation)}</td>
    </tr>`,
		)
		.join("");

	return `
<!DOCTYPE html>
<html>
<head>
  <title>Benchmark Results</title>
  <style>
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #4CAF50; color: white; }
    tr:nth-child(even) { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>Benchmark Results</h1>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Ops/sec</th>
        <th>Average</th>
        <th>Min</th>
        <th>Max</th>
        <th>StdDev</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</body>
</html>`;
};
