import { Context, Effect, Layer } from "effect";
import { execute } from "task-runner";
import type { Result, RunnerError, RunnerResult } from "task-runner";
import type {
	ContainerConfig,
	ContainerInfo,
	ContainerStatus,
	ExecuteResult,
	PackageManagerType,
	Shell,
} from "../types";
import { generateContainerId, generateContainerName, mergeResourceLimits } from "../utils";

export class WebContainerService extends Context.Tag("WebContainerService")<
	WebContainerService,
	{
		readonly start: () => Effect.Effect<void, Error>;
		readonly stop: () => Effect.Effect<void, Error>;
		readonly execute: (command: string) => Effect.Effect<ExecuteResult, Error>;
		readonly install: (
			packages?: readonly string[],
		) => Effect.Effect<ExecuteResult, Error>;
		readonly uninstall: (
			packages: readonly string[],
		) => Effect.Effect<ExecuteResult, Error>;
		readonly runScript: (
			script: string,
			args?: readonly string[],
		) => Effect.Effect<ExecuteResult, Error>;
		readonly test: () => Effect.Effect<ExecuteResult, Error>;
		readonly build: () => Effect.Effect<ExecuteResult, Error>;
		readonly dev: () => Effect.Effect<ExecuteResult, Error>;
		readonly getInfo: () => ContainerInfo;
		readonly getStatus: () => ContainerStatus;
		readonly isRunning: () => boolean;
	}
>() {}

const packageManagerCommand = (packageManager: PackageManagerType): string =>
	packageManager === "bun" ? "bun" : packageManager;

const shellOptionFromShell = (shell: Shell): boolean | string => {
	if (shell === "pwsh") return "pwsh";
	if (shell === "cmd") return "cmd.exe";
	return true;
};

const toExecuteResult = (
	result: { success: boolean; stdout: string; stderr: string; exitCode: number | null; duration: number },
): ExecuteResult => ({
	success: result.success,
	stdout: result.stdout,
	stderr: result.stderr,
	exitCode: result.exitCode ?? 1,
	duration: result.duration,
});

const make = (config: ContainerConfig) =>
	Effect.sync(() => {
		const id = generateContainerId();
		const name = config.name || generateContainerName();
		const shell = (config.shell ?? "bash") satisfies Shell;
		const packageManager = (config.packageManager ?? "npm") satisfies PackageManagerType;
		const resourceLimits = mergeResourceLimits(config.resourceLimits);
		const createdAt = Date.now();

		let status: ContainerStatus = "idle";
		let startedAt: number | undefined;
		let stoppedAt: number | undefined;

		const ensureRunning = (): Effect.Effect<void, Error> =>
			status === "running"
				? Effect.void
				: Effect.fail(new Error("Container is not running. Call start() first."));

		const run = (
			options: { readonly command: string; readonly args?: readonly string[] },
		): Effect.Effect<ExecuteResult, Error> =>
			Effect.gen(function*() {
				yield* ensureRunning();
				const args = options.args ?? [];
				const env = config.env ?? {};
				const result: Result<RunnerResult, RunnerError> = yield* Effect.promise(() =>
					execute({
						command: options.command,
						args,
						cwd: config.workdir,
						env,
						timeout: resourceLimits.timeout,
						shell: shellOptionFromShell(shell),
					})
				);

				if (!result.success) {
					return yield* Effect.fail(
						result.error instanceof Error
							? result.error
							: new Error("Command execution failed"),
					);
				}
				return toExecuteResult(result.value);
			});

		return WebContainerService.of({
			start: () =>
				Effect.sync(() => {
					if (status === "running") {
						throw new Error("Container is already running");
					}
					status = "running";
					startedAt = Date.now();
				}),

			stop: () =>
				Effect.gen(function*() {
					if (status !== "running") {
						yield* Effect.fail(new Error("Container is not running"));
					}
					status = "stopped";
					stoppedAt = Date.now();
				}),

			execute: (command: string) => run({ command }),

			runScript: (script: string, args: readonly string[] = []) =>
				run({
					command: packageManagerCommand(packageManager),
					args: ["run", script, ...args],
				}),

			test: () =>
				run({
					command: packageManagerCommand(packageManager),
					args: ["test"],
				}),

			build: () =>
				run({
					command: packageManagerCommand(packageManager),
					args: ["run", "build"],
				}),

			dev: () =>
				run({
					command: packageManagerCommand(packageManager),
					args: ["run", "dev"],
				}),

			install: (packages: readonly string[] = []) =>
				run({
					command: packageManagerCommand(packageManager),
					args: packageManager === "npm"
						? ["install", ...packages]
						: ["add", ...packages],
				}),

			uninstall: (packages: readonly string[]) =>
				run({
					command: packageManagerCommand(packageManager),
					args: packageManager === "npm"
						? ["uninstall", ...packages]
						: ["remove", ...packages],
				}),

			getInfo: (): ContainerInfo => {
				const baseInfo: ContainerInfo = {
					createdAt,
					id,
					name,
					packageManager,
					shell,
					status,
					workdir: config.workdir,
				};

				if (startedAt !== undefined) {
					return { ...baseInfo, startedAt };
				}
				if (stoppedAt !== undefined) {
					return { ...baseInfo, stoppedAt };
				}
				return baseInfo;
			},

			getStatus: () => status,
			isRunning: () => status === "running",
		});
	});

export const WebContainerServiceLive = (config: ContainerConfig) => Layer.effect(WebContainerService, make(config));
