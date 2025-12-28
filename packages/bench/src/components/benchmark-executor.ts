import { execa } from "execa";
import { calculateStats } from "../lib/benchmark";
import { runCommand } from "../lib/runner";
import type { BenchmarkOptions, BenchmarkResult } from "../types/index";

/**
 * Execute warmup runs to reduce cold start bias
 *
 * @param command - The command to warm up
 * @param options - Benchmark options including warmup count, prepare/cleanup commands, and shell
 *
 * @example
 * ```ts
 * await executeWarmup("npm run test", {
 *   warmup: 3,
 *   shell: "bash"
 * });
 * ```
 */
export const executeWarmup = async (
	command: string,
	options: BenchmarkOptions,
): Promise<void> => {
	const { warmup = 0, prepare, cleanup, shell = "bash", silent } = options;

	if (!silent && warmup > 0) {
		console.log(`Running ${warmup} warmup iteration(s)...`);
	}

	for (let i = 0; i < warmup; i++) {
		if (prepare) await execa(shell, ["-c", prepare]);
		await runCommand(command, shell);
		if (cleanup) await execa(shell, ["-c", cleanup]);
	}
};

/**
 * Execute benchmark runs and collect timing data
 *
 * @param command - The command to benchmark
 * @param options - Benchmark options including runs count, prepare/cleanup commands, and shell
 * @returns Array of execution times in milliseconds
 *
 * @example
 * ```ts
 * const times = await executeBenchmarkRuns("npm run test", {
 *   runs: 10,
 *   shell: "bash"
 * });
 * console.log(`Average: ${times.reduce((a, b) => a + b) / times.length}ms`);
 * ```
 */
export const executeBenchmarkRuns = async (
	command: string,
	options: BenchmarkOptions,
): Promise<number[]> => {
	const { runs = 10, concurrency = 1, prepare, cleanup, shell = "bash", silent, verbose } = options;

	if (!silent) {
		console.log(`Running ${runs} benchmark iteration(s)...`);
	}

	const times: number[] = [];
	let errorCount = 0;
	const startCpu = process.cpuUsage();
	const startResourceUsage = typeof process.resourceUsage === "function" ? process.resourceUsage() : undefined;
	let maxRssBytes = process.memoryUsage().rss;

	const parallel = Math.max(1, concurrency);

	for (let i = 0; i < runs; i++) {
		if (prepare) await execa(shell, ["-c", prepare]);
		try {
			const startTime = performance.now();
			const settled = await Promise.allSettled(
				Array.from({ length: parallel }, () => runCommand(command, shell)),
			);
			const endTime = performance.now();
			const batchErrors = settled.filter((r) => r.status === "rejected").length;
			errorCount += batchErrors;
			times.push(endTime - startTime);
			maxRssBytes = Math.max(maxRssBytes, process.memoryUsage().rss);
			if (verbose) {
				console.log(`  Run ${i + 1}: ${(endTime - startTime).toFixed(2)} ms (${parallel}x)`);
			}
		} catch {
			errorCount += parallel;
			if (verbose) {
				console.log(`  Run ${i + 1}: failed (${parallel}x)`);
			}
		} finally {
			if (cleanup) await execa(shell, ["-c", cleanup]);
		}
	}

	const cpu = process.cpuUsage(startCpu);
	const endResourceUsage = typeof process.resourceUsage === "function" ? process.resourceUsage() : undefined;
	const fsReadBytes = startResourceUsage && endResourceUsage
		? Math.max(0, endResourceUsage.fsRead - startResourceUsage.fsRead)
		: 0;
	const fsWriteBytes = startResourceUsage && endResourceUsage
		? Math.max(0, endResourceUsage.fsWrite - startResourceUsage.fsWrite)
		: 0;

	if (times.length === 0) {
		throw new Error(`All benchmark runs failed (${errorCount}/${runs})`);
	}

	// Attach errorCount to the array object for later consumption (internal convention)
	Object.defineProperty(times, "_errorCount", { value: errorCount, enumerable: false });
	Object.defineProperty(times, "_requestedRuns", { value: runs, enumerable: false });
	Object.defineProperty(times, "_resource", {
		value: {
			cpuUserMicros: cpu.user,
			cpuSystemMicros: cpu.system,
			maxRssBytes,
			fsReadBytes,
			fsWriteBytes,
		},
		enumerable: false,
	});
	return times;
};

/**
 * Execute complete benchmark (warmup + runs) and calculate statistics
 *
 * @param command - The command to benchmark
 * @param options - Complete benchmark options
 * @returns Benchmark result with calculated statistics
 *
 * @example
 * ```ts
 * const result = await executeBenchmark("npm run test", {
 *   warmup: 3,
 *   runs: 10,
 *   shell: "bash"
 * });
 * console.log(`Mean: ${result.mean}ms ± ${result.stddev}ms`);
 * ```
 */
export const executeBenchmark = async (
	command: string,
	options: BenchmarkOptions,
): Promise<BenchmarkResult> => {
	// Warmup phase
	await executeWarmup(command, options);

	// Benchmark runs
	const times = await executeBenchmarkRuns(command, options);
	const errorCount = (times as unknown as { _errorCount?: number })._errorCount ?? 0;
	const requestedRuns = (times as unknown as { _requestedRuns?: number })._requestedRuns ?? times.length;
	const resource = (times as unknown as {
		_resource?: {
			readonly cpuUserMicros: number;
			readonly cpuSystemMicros: number;
			readonly maxRssBytes: number;
			readonly fsReadBytes: number;
			readonly fsWriteBytes: number;
		};
	})._resource ?? {
		cpuUserMicros: 0,
		cpuSystemMicros: 0,
		maxRssBytes: 0,
		fsReadBytes: 0,
		fsWriteBytes: 0,
	};

	// Calculate statistics
	return calculateStats(command, times, errorCount, requestedRuns, resource);
};
