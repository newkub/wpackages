import { glob } from "glob";
import { ConsoleReporter } from "../reporter/console";
import { loadConfig } from "../config";
import { parseCliOptions } from "./cli";
import { generateCoverageReport } from "./coverage";
import { startWatcher } from "./watcher";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

export async function run() {
	const { watch, coverage, updateSnapshots, testNamePattern, shard, timeoutMs, retries } = parseCliOptions();
	const cwd = process.cwd();
	const config = await loadConfig(cwd);

	if (coverage) {
		console.log("\nGenerating coverage report...");
		// Delegate to bun test for coverage (Bun's native coverage works with bun test)
		const testFiles = await glob(config.testMatch!, { cwd });
		const testArgs = ["test", "--coverage"];
		if (testNamePattern) testArgs.push("--test-name-pattern", testNamePattern);
		if (shard) testArgs.push("--shard", shard);
		if (timeoutMs) testArgs.push("--timeout-ms", String(timeoutMs));
		if (retries) testArgs.push("--retries", String(retries));
		if (updateSnapshots) testArgs.push("--update-snapshots");
		testArgs.push(...testFiles);

		const proc = Bun.spawn({ cmd: ["bun", ...testArgs], stdout: "inherit", stderr: "inherit", cwd });
		const exitCode = await proc.exited;
		if (exitCode !== 0) {
			process.exit(exitCode);
		}
		return;
	}

	const testFiles = await glob(config.testMatch!, { cwd, absolute: true });
	const reporter = new ConsoleReporter();
	const numWorkers = navigator.hardwareConcurrency || 4;
	const fileQueue = [...testFiles];
	const allCoverageData: any[] = [];

	async function runWorker() {
		while (fileQueue.length > 0) {
			const file = fileQueue.shift();
			if (!file) continue;

			// Mocking logic using AST
			const fileContent = await fs.readFile(file, "utf-8");
			const mockCalls: { path: string, factory?: string }[] = [];

			try {
				const ast = parse(fileContent, { sourceType: 'module', plugins: ['typescript'] });
				traverse(ast, {
					CallExpression(p) {
						const { node } = p;
						if (
							node.callee.type === "MemberExpression" &&
							node.callee.object.type === "Identifier" &&
							node.callee.object.name === "w" &&
							node.callee.property.type === "Identifier" &&
							node.callee.property.name === "mock"
						) {
							const firstArg = node.arguments[0];
							if (!firstArg || firstArg.type !== "StringLiteral") return;

							const modulePath = firstArg.value;
							const secondArg = node.arguments[1];

							if (!secondArg) {
								mockCalls.push({ path: modulePath });
								return;
							}

							if (typeof secondArg.start !== "number" || typeof secondArg.end !== "number") {
								mockCalls.push({ path: modulePath });
								return;
							}

							const factory = fileContent.substring(secondArg.start, secondArg.end);
							mockCalls.push({ path: modulePath, factory });
						}
					},
				});
			} catch (e) {
				console.error(`Failed to parse mocks in ${file}:`, e);
			}

			let preloadFile: string | undefined;

			if (mockCalls.length > 0) {
				const factoryMocks = mockCalls.filter(m => m.factory);
				const autoMocks = mockCalls.filter(m => !m.factory);

				const createMockPath = fileURLToPath(new URL("../../utils/mock.ts", import.meta.url));

				const preloadContent = `
					import { plugin } from "bun";
					import { createMock } from "${createMockPath.replace(/\\/g, "\\\\")}";
					import fs from "node:fs/promises";

					// --- Injected Mock Factories ---
					${factoryMocks.map((m, i) => `const factory_${i} = ${m.factory};`).join('\n')}
					// -----------------------------

					await plugin({
						name: "wtest-custom-mock",
						async setup(build) {
							const autoMockPaths = ${JSON.stringify(autoMocks.map(m => m.path))};
							const factoryMockPaths = ${JSON.stringify(factoryMocks.map(m => m.path))};
							const factories = [${factoryMocks.map((_, i) => `factory_${i}`).join(', ')}];

							const autoMockResolutionMap = new Map<string, string>();
							for (const mockPath of autoMockPaths) {
								const resolved = await Bun.resolve(mockPath, path.dirname("${file.replace(/\\/g, "\\\\")}"));
								autoMockResolutionMap.set(resolved, mockPath);
							}

							const factoryMockResolutionMap = new Map<string, number>();
							for (let i = 0; i < factoryMockPaths.length; i++) {
								const resolved = await Bun.resolve(factoryMockPaths[i], path.dirname("${file.replace(/\\/g, "\\\\")}"));
								factoryMockResolutionMap.set(resolved, i);
							}

							build.onLoad({ filter: /.*/ }, async (args) => {
								// Handle factory mocks
								if (factoryMockResolutionMap.has(args.path)) {
									const factoryIndex = factoryMockResolutionMap.get(args.path)!;
									const factory = factories[factoryIndex];
									const mockedModule = await Promise.resolve(factory());
									return { exports: mockedModule, loader: 'object' };
								}

								// Handle auto mocks
								if (autoMockResolutionMap.has(args.path)) {
									const originalModule = await import(args.path);
									const mockedModule = {};
									for (const key in originalModule) {
										if (typeof originalModule[key] === 'function') {
											mockedModule[key] = createMock();
										} else {
											mockedModule[key] = originalModule[key];
										}
									}
									return { exports: mockedModule, loader: 'object' };
								}

								// Default loader for non-mocked files
								const contents = await fs.readFile(args.path, "utf8");
								return { contents, loader: "ts" };
							});
						}
					});
				`;
				preloadFile = path.join(cwd, `.${path.basename(file)}.mock.preload.ts`);
				await fs.writeFile(preloadFile, preloadContent);
			}

			const runtimeSetupPath = fileURLToPath(new URL("../../runtime/setup.ts", import.meta.url));
			const runTestScriptPath = fileURLToPath(new URL("../../../bin/run-test.ts", import.meta.url));

			const cmd = ["bun"];
			if (coverage) {
				cmd.push("--coverage");
			}
			if (preloadFile) {
				cmd.push("--preload", preloadFile);
			}
			cmd.push("--preload", runtimeSetupPath, runTestScriptPath, file);
			if (testNamePattern) {
				cmd.push("--testNamePattern", testNamePattern);
			}
			if (shard) {
				cmd.push("--shard", shard);
			}
			const resolvedTimeoutMs = timeoutMs ?? config.testTimeoutMs;
			if (typeof resolvedTimeoutMs === "number" && Number.isFinite(resolvedTimeoutMs)) {
				cmd.push("--timeout-ms", String(resolvedTimeoutMs));
			}
			const resolvedRetries = retries ?? config.retries;
			if (typeof resolvedRetries === "number" && Number.isFinite(resolvedRetries) && resolvedRetries > 0) {
				cmd.push("--retries", String(resolvedRetries));
			}
			if (coverage) {
				cmd.push("--coverage");
			}
			if (updateSnapshots) {
				cmd.push("--update-snapshots");
			}

			const coverageDir = coverage ? path.join(cwd, ".wtest-coverage", path.basename(file)) : undefined;
			if (coverageDir) {
				await fs.mkdir(coverageDir, { recursive: true });
			}

			const env: Record<string, string | undefined> | undefined = coverageDir
				? {
					...process.env,
					NODE_V8_COVERAGE: coverageDir,
				}
				: undefined;
			const worker = env
				? Bun.spawn({ cmd, stdout: "pipe", stderr: "pipe", env })
				: Bun.spawn({ cmd, stdout: "pipe", stderr: "pipe" });
			const stdout = await Bun.readableStreamToText(worker.stdout);
			const stderr = await Bun.readableStreamToText(worker.stderr);
			const exitCode = await worker.exited;

			if (exitCode !== 0) {
				console.error(`Test worker for ${file} exited with code ${exitCode}`);
				if (stderr.trim()) {
					console.error(stderr);
				}
				continue;
			}

			try {
				const marker = "__WTEST_RESULT__";
				const markerIndex = stdout.lastIndexOf(marker);
				const jsonText = markerIndex >= 0 ? stdout.slice(markerIndex + marker.length).trim() : stdout.trim();
				const result = JSON.parse(jsonText);
				if (result.error) {
					console.error(`Error in test file ${file}: ${result.error}`);
				} else {
					result.results.forEach((res: any) => reporter.addResult(res));
					if (coverageDir) {
						try {
							const entries = await fs.readdir(coverageDir, { withFileTypes: true });
							for (const entry of entries) {
								if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
								const content = await fs.readFile(path.join(coverageDir, entry.name), "utf8");
								const parsed = JSON.parse(content);
								if (parsed && Array.isArray(parsed.result)) {
									allCoverageData.push(...parsed.result);
								}
							}
						} catch {
							// ignore missing coverage output
						}
					}
				}
			} catch (e: any) {
				console.error(`Failed to parse test results from ${file}: ${e.message}`);
			} finally {
				if (preloadFile) {
					await fs.unlink(preloadFile);
				}
			}
		}
	}

	const workers = Array.from({ length: numWorkers }, () => runWorker());
	await Promise.all(workers);

	reporter.printSummary();

	if (coverage) {
		await generateCoverageReport(allCoverageData, cwd);
	}

	if (watch) {
		await startWatcher(cwd);
	} else if (reporter.getResults().some(r => r.status === 'failed')) {
        process.exit(1);
    }
}
