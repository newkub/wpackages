/**
 * Main application layer for code-quality
 *
 * Composes all services and components to provide the linting functionality
 */

import { Effect } from "effect";
import { DEFAULT_CONFIG } from "./config";
import { ALL_RULES } from "./rules";
import { findFilesInMultipleDirs } from "./services/file-finder.service";
import { lintFiles } from "./services/linter.service";
import type { FileSystemError, LinterOptions, LintReport, SemanticLinterError } from "./types";

/**
 * Lint configuration options
 */
export type LintOptions = {
	readonly paths: readonly string[];
	readonly rules?: Record<string, "off" | "warning" | "error">;
	readonly fix?: boolean;
	readonly silent?: boolean;
	readonly ignore?: readonly string[];
};

/**
 * Main lint function - Orchestrates the linting process
 *
 * @param options - Linting options
 * @returns Promise with lint report or error
 */
export const lint = (
	options: LintOptions,
): Effect.Effect<LintReport, FileSystemError | SemanticLinterError> =>
	Effect.gen(function*(_) {
		const {
			rules: customRules,
			fix = false,
			silent = false,
			ignore = DEFAULT_CONFIG.ignore,
		} = options;

		const mergedRules = { ...DEFAULT_CONFIG.rules, ...customRules };

		const linterOptions: LinterOptions = {
			rules: mergedRules,
			fix,
			ignore,
			extensions: DEFAULT_CONFIG.extensions,
		};

		const files = yield* _(findFilesInMultipleDirs(options.paths, ignore));

		if (!silent) {
			yield* _(Effect.log(`🔍 Found ${files.length} file(s) to lint`));
		}

		if (files.length === 0) {
			return {
				results: [],
				errorCount: 0,
				warningCount: 0,
				fixableErrorCount: 0,
				fixableWarningCount: 0,
				filesLinted: 0,
			};
		}

		const report = yield* _(lintFiles(files, ALL_RULES, linterOptions));

		if (!silent) {
			yield* _(Effect.log(`✅ Linting complete: ${report.errorCount} errors, ${report.warningCount} warnings`));
		}

		return report;
	});

/**
 * Lint with default configuration
 *
 * @param paths - Paths to lint
 * @returns Promise with lint report or error
 */
export const lintWithDefaults = (
	paths: readonly string[],
): Effect.Effect<LintReport, FileSystemError | SemanticLinterError> => lint({ paths });

/**
 * Main entry point for CLI
 */
export async function run() {
	console.log("format - Coming soon!");
}
