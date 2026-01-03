import { spawn } from "node:child_process";
import type { Result, RunnerError, RunnerOptions, RunnerResult } from "../../types";
import { err, ok } from "../../types/result";
import { createRunnerError } from "../error";
import { buildPath, normalizeOptions, parseEnv, stripFinalNewline } from "../parse";

/**
 * Execute a command asynchronously
 */
export const execute = async (
	options: RunnerOptions,
): Promise<Result<RunnerResult, RunnerError>> => {
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

	return new Promise((resolve) => {
		const env = parseEnv(options.env);

		// Update PATH if preferLocal
		if (normalized.preferLocal) {
			env["PATH"] = buildPath({
				preferLocal: true,
				...(options.localDir !== undefined && { localDir: options.localDir }),
				...(options.cwd !== undefined && { cwd: options.cwd }),
			});
		}

		// Spawn process
		const child: any = spawn(options.command, options.args ?? [], {
			cwd: options.cwd,
			env,
			shell: options.shell ?? false,
			signal: options.signal,
			stdio: normalized.inheritStdio
				? "inherit"
				: [normalized.stdin as any, normalized.stdout as any, normalized.stderr as any],
			killSignal: options.killSignal,
		});

		let stdout = "";
		let stderr = "";
		let timedOut = false;
		let timeoutId: NodeJS.Timeout | undefined;

		// Set timeout
		if (options.timeout) {
			timeoutId = setTimeout(() => {
				timedOut = true;
				child.kill(options.killSignal ?? "SIGTERM");
			}, options.timeout);
		}

		// Collect stdout
		if (child.stdout) {
			child.stdout.on("data", (chunk: Buffer) => {
				const data = chunk.toString(normalized.encoding);
				stdout += data;

				if (normalized.verbose) {
					process.stdout.write(data);
				}
			});
		}

		// Collect stderr
		if (child.stderr) {
			child.stderr.on("data", (chunk: Buffer) => {
				const data = chunk.toString(normalized.encoding);
				stderr += data;

				if (normalized.verbose) {
					process.stderr.write(data);
				}
			});
		}

		// Handle stdin input
		if (options.input && child.stdin) {
			child.stdin.write(options.input);
			child.stdin.end();
		}

		// Handle exit
		child.on(
			"close",
			(exitCode: number | null, signal: NodeJS.Signals | null) => {
				if (timeoutId) {
					clearTimeout(timeoutId);
				}

				const duration = Date.now() - startTime;

				// Strip final newline if needed
				if (normalized.stripFinalNewline) {
					stdout = stripFinalNewline(stdout);
					stderr = stripFinalNewline(stderr);
				}

				const result: RunnerResult = {
					command: `${options.command} ${options.args?.join(" ") ?? ""}`,
					exitCode,
					stdout,
					stderr,
					output: stdout + stderr,
					success: exitCode === 0 && signal === null,
					signal,
					duration,
					killed: child.killed || signal !== null,
					timedOut,
				};

				// Check if should reject on error
				if (
					normalized.rejectOnError
					&& (exitCode !== 0 || signal !== null || timedOut)
				) {
					const error = createRunnerError({
						command: result.command,
						exitCode,
						stdout,
						stderr,
						signal,
						timedOut,
						killed: result.killed,
					});

					resolve(err(error));
				} else {
					resolve(ok(result));
				}
			},
		);

		// Handle error
		child.on("error", (error: Error) => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			const runnerError = createRunnerError({
				command: `${options.command} ${options.args?.join(" ") ?? ""}`,
				exitCode: null,
				stdout,
				stderr: error.message,
				signal: null,
				timedOut,
				killed: false,
				message: error.message,
			});

			resolve(err(runnerError));
		});
	});
};
