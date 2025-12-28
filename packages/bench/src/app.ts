import { executeBenchmark } from "./components/benchmark-executor";
import { formatBenchmarkResult, formatChart, formatComparison, formatJson, formatTable } from "./components/index";
import { createBenchmarkConfig } from "./config/index";
import { compareResults } from "./lib/benchmark";
import { ConsoleService } from "./services/index";
import type { BenchmarkOptions, BenchmarkResult, ComparisonResult } from "./types/index";

export const runBenchmark = async (
	commands: string[],
	partialOptions: Partial<BenchmarkOptions> = {},
): Promise<BenchmarkResult | ComparisonResult> => {
	const options = createBenchmarkConfig(partialOptions);

	try {
		if (commands.length === 1) {
			const command = commands[0]!;
			if (!options.silent) {
				await ConsoleService.log(`🔥 Benchmarking: ${command}\n`);
			}

			const result = await executeBenchmark(command, options);

			if (!options.silent) {
				await ConsoleService.log(formatBenchmarkResult(result));
			}

			if (options.export) {
				await Bun.write(options.export, JSON.stringify(result, null, 2));
				if (!options.silent) {
					await ConsoleService.success(`\n✓ Results exported to ${options.export}`);
				}
			}

			return result;
		} else {
			if (!options.silent) {
				await ConsoleService.log(`🔥 Benchmarking ${commands.length} commands...\n`);
			}

			const results: BenchmarkResult[] = [];
			for (const command of commands) {
				if (!options.silent) {
					await ConsoleService.log(`\nBenchmarking: ${command}`);
				}
				const result = await executeBenchmark(command, options);
				results.push(result);
			}

			const comparison = compareResults(results);

			if (!options.silent) {
				switch (options.output) {
					case "json":
						await ConsoleService.log(formatJson(comparison));
						break;
					case "table":
						await ConsoleService.log(formatTable(comparison));
						break;
					case "chart":
						await ConsoleService.log(formatChart(comparison));
						break;
					default:
						await ConsoleService.log(formatComparison(comparison));
				}
			}

			if (options.export) {
				await Bun.write(options.export, JSON.stringify(comparison, null, 2));
				if (!options.silent) {
					await ConsoleService.success(`\n✓ Results exported to ${options.export}`);
				}
			}

			return comparison;
		}
	} catch (error) {
		throw error instanceof Error ? error : new Error("Benchmark failed");
	}
};
