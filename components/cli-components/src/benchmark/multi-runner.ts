import { executeBenchmark } from "../components/benchmark-executor";
import { compareResults } from "../lib/benchmark";
import type { BenchComparison, BenchmarkOptions, BenchmarkResult } from "../types/index";
import { exportResult } from "./exporter";
import { formatOutput } from "./output-formatter";

export async function runMultiBenchmark(
	commands: string[],
	options: BenchmarkOptions,
): Promise<BenchComparison> {
	if (!options.silent) {
		console.log(`🔥 Benchmarking ${commands.length} commands...\n`);
	}

	const results: BenchmarkResult[] = [];
	for (const command of commands) {
		if (!options.silent) {
			console.log(`\nBenchmarking: ${command}`);
		}
		const result = await executeBenchmark(command, options);
		results.push(result);
	}

	const comparison = compareResults(results);

	if (!options.silent) {
		console.log(formatOutput(comparison, options.output || "comparison"));
	}

	if (options.export) {
		await exportResult(options.export, comparison, options.silent);
	}

	return comparison;
}
