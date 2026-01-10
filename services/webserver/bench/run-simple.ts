import { spawn, Subprocess } from "bun";

type BenchCase = "small" | "medium" | "large";

type CaseConfig = {
	readonly routes: number;
	readonly payloadBytes: number;
	readonly requests: number;
	readonly concurrency: number;
};

const CASES: Record<BenchCase, CaseConfig> = {
	small: { routes: 1, payloadBytes: 64, requests: 2_000, concurrency: 50 },
	medium: { routes: 50, payloadBytes: 1_024, requests: 5_000, concurrency: 100 },
	large: { routes: 300, payloadBytes: 8_192, requests: 10_000, concurrency: 100 },
};

const makePayload = (bytes: number): string => {
	if (bytes <= 0) return "";
	return "x".repeat(bytes);
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string): Promise<void> => {
	let lastError: unknown;
	for (let attempt = 0; attempt < 10; attempt++) {
		try {
			const res = await fetch(url);
			await res.arrayBuffer();
			return;
		} catch (error) {
			lastError = error;
			await sleep(10 * (attempt + 1));
		}
	}
	throw lastError;
};

const waitForReady = async (url: string, timeoutMs: number): Promise<void> => {
	const startedAt = Date.now();
	let lastError: unknown;
	let attempt = 0;
	while (Date.now() - startedAt < timeoutMs) {
		attempt++;
		try {
			const res = await fetch(url);
			await res.arrayBuffer();
			return;
		} catch (e) {
			lastError = e;
			await sleep(Math.min(250, 10 * attempt));
		}
	}
	throw new Error(`Server not ready: ${url}${lastError ? `\nLast error: ${String(lastError)}` : ""}`);
};

const pickBasePort = (benchCase: BenchCase, suffix: number): number => {
	if (suffix === 0) {
		if (benchCase === "small") return 40101;
		if (benchCase === "medium") return 40102;
		return 40103;
	}
	if (suffix === 1) {
		if (benchCase === "small") return 40201;
		if (benchCase === "medium") return 40202;
		return 40203;
	}
	return 40000 + suffix * 100;
};

const startWebserverProcess = (port: number, payloadBytes: number): Subprocess => {
	return spawn({
		cmd: ["bun", "./bench/sample/wpackages.ts", "--case", "small"],
		stdin: "ignore",
		stdout: "pipe",
		stderr: "pipe",
		env: {
			...process.env,
			PORT: String(port),
			PAYLOAD_BYTES: String(payloadBytes),
		},
		cwd: process.cwd(),
	});
};

const startElysiaProcess = (port: number, payloadBytes: number): Subprocess => {
	return spawn({
		cmd: ["bun", "./bench/sample/elysia.ts", "--case", "small", "--server"],
		stdin: "ignore",
		stdout: "pipe",
		stderr: "pipe",
		env: {
			...process.env,
			PORT: String(port),
			PAYLOAD_BYTES: String(payloadBytes),
		},
		cwd: process.cwd(),
	});
};

const runLoad = async (url: string, requests: number, concurrency: number): Promise<number> => {
	const start = Date.now();
	const batches = Math.ceil(requests / concurrency);
	for (let b = 0; b < batches; b++) {
		const count = Math.min(concurrency, requests - b * concurrency);
		await Promise.all(
			Array.from({ length: count }, async () => {
				await fetchWithRetry(url);
			}),
		);
	}
	return Date.now() - start;
};

type BenchResult = {
	readonly name: string;
	readonly totalTimeMs: number;
	readonly requestsPerSec: number;
};

const formatResult = (result: BenchResult): string => {
	return `${result.name.padEnd(20)} | ${result.totalTimeMs.toString().padStart(8)} ms | ${result.requestsPerSec.toFixed(2).padStart(10)} req/s`;
};

const main = async (): Promise<void> => {
	console.log("=== Simple Benchmark: @wpackages/webserver vs Elysia ===\n");

	const selectedCases: BenchCase[] = ["small", "medium", "large"];

	for (const benchCase of selectedCases) {
		console.log(`\n--- Case: ${benchCase} ---`);
		const config = CASES[benchCase];
		const payloadBytes = config.payloadBytes;

		let webserverPort = pickBasePort(benchCase, 0);
		let elysiaPort = pickBasePort(benchCase, 1);
		let webserverProc: Subprocess | undefined;
		let elysiaProc: Subprocess | undefined;

		try {
			console.log(`Starting webserver on port ${webserverPort}...`);
			webserverProc = startWebserverProcess(webserverPort, payloadBytes);
			await waitForReady(`http://127.0.0.1:${webserverPort}/`, 10_000);
			console.log(`Webserver ready on port ${webserverPort}`);

			console.log(`Starting Elysia on port ${elysiaPort}...`);
			elysiaProc = startElysiaProcess(elysiaPort, payloadBytes);
			await waitForReady(`http://127.0.0.1:${elysiaPort}/`, 10_000);
			console.log(`Elysia ready on port ${elysiaPort}`);

			console.log(`\nRunning ${config.requests} requests with concurrency ${config.concurrency}...`);

			const webserverTime = await runLoad(`http://127.0.0.1:${webserverPort}/`, config.requests, config.concurrency);
			const webserverResult: BenchResult = {
				name: "@wpackages/webserver",
				totalTimeMs: webserverTime,
				requestsPerSec: (config.requests / webserverTime) * 1000,
			};

			const elysiaTime = await runLoad(`http://127.0.0.1:${elysiaPort}/`, config.requests, config.concurrency);
			const elysiaResult: BenchResult = {
				name: "Elysia",
				totalTimeMs: elysiaTime,
				requestsPerSec: (config.requests / elysiaTime) * 1000,
			};

			console.log(`\nResults:`);
			console.log("-".repeat(50));
			console.log(`{"Name".padEnd(20)} | {"Time".padStart(8)} | {"Req/s".padStart(10)}`);
			console.log("-".repeat(50));
			console.log(formatResult(webserverResult));
			console.log(formatResult(elysiaResult));
			console.log("-".repeat(50));

			const speedup = elysiaTime / webserverTime;
			const winner = webserverTime < elysiaTime ? "@wpackages/webserver" : "Elysia";
			console.log(`\nWinner: ${winner}`);
			console.log(`Speedup: ${speedup.toFixed(2)}x`);
		} finally {
			if (webserverProc) {
				webserverProc.kill();
				await webserverProc.exited;
			}
			if (elysiaProc) {
				elysiaProc.kill();
				await elysiaProc.exited;
			}
		}
	}

	console.log("\n=== Benchmark Complete ===");
};

await main();
