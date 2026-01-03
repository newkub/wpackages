import { execSync } from "node:child_process";
import type { Result, RunnerError, RunnerOptions, RunnerResult } from "../../types";
import { err, ok } from "../../types/result";
import { createRunnerError } from "../error";
import { buildPath, normalizeOptions, parseEnv, stripFinalNewline } from "../parse";

/**
 * Execute synchronously (for simple cases)
 */
export const executeSync = (
	options: RunnerOptions,
): Result<RunnerResult, RunnerError> => {
	// Note: This is a simplified sync version using Node's execSync
	const normalized = normalizeOptions(options);
	const startTime = Date.now();

	// Dry run mode
	if (normalized.dryRun) {
		const commandStr = `${options.command} ${options.args?.join(" ") ?? ""}`;
		console.log(`[DRY RUN] Would execute: ${commandStr}`);
		return ok({
			command: commandStr,
			exitCode: 0,
			stdout: "",
			stderr: "",
			output: "",
			success: true,
			signal: null,
			duration: 0,
			killed: false,
			timedOut: false,
		});
	}

	try {
		const env = parseEnv(options.env);

		if (normalized.preferLocal) {
			env["PATH"] = buildPath({
				preferLocal: true,
				...(options.localDir !== undefined && { localDir: options.localDir }),
				...(options.cwd !== undefined && { cwd: options.cwd }),
			});
		}

		const commandStr = `${options.command} ${options.args?.join(" ") ?? ""}`;

		const result = execSync(commandStr, {
			cwd: options.cwd,
			env,
			encoding: normalized.encoding,
			shell: typeof options.shell === "string" ? options.shell : undefined,
			timeout: options.timeout,
			maxBuffer: options.maxBuffer,
			killSignal: options.killSignal,
			input: options.input,
		});

		const duration = Date.now() - startTime;
		let stdout = result.toString();

		if (normalized.stripFinalNewline) {
			stdout = stripFinalNewline(stdout);
		}

		return ok({
			command: commandStr,
			exitCode: 0,
			stdout,
			stderr: "",
			output: stdout,
			success: true,
			signal: null,
			duration,
			killed: false,
			timedOut: false,
		});
	} catch (error: unknown) {
		const commandStr = `${options.command} ${options.args?.join(" ") ?? ""}`;
		if (error instanceof Error && "status" in error) {
			const runnerError = createRunnerError({
				command: commandStr,
				exitCode: (error as any).status ?? null,
				stdout: (error as any).stdout?.toString() ?? "",
				stderr: (error as any).stderr?.toString() ?? "",
				signal: (error as any).signal ?? null,
				timedOut: false,
				killed: (error as any).killed ?? false,
				message: error.message,
			});
			return err(runnerError);
		} else if (error instanceof Error) {
			return err(
				createRunnerError({
					command: commandStr,
					message: error.message,
					exitCode: 1,
					stdout: "",
					stderr: "",
					signal: null,
					timedOut: false,
					killed: false,
				}),
			);
		}
		return err(
			createRunnerError({
				command: commandStr,
				message: "An unknown error occurred",
				exitCode: 1,
				stdout: "",
				stderr: "",
				signal: null,
				timedOut: false,
				killed: false,
			}),
		);
	}
};
