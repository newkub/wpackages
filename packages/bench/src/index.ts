/**
 * The main entry point for running benchmarks from the CLI or programmatically.
 */
export { runBenchmark } from "./app";

/**
 * Core types used for configuring and interpreting benchmark results.
 */
export type { BenchmarkOptions, BenchmarkResult, ComparisonResult } from "./types/index";

/**
 * CLI helpers
 */
export { ConsoleService, ConsoleServiceLive } from "./services";
export { parseCliArgs } from "./utils";
