#!/usr/bin/env bun
import { glob } from "glob";
import { ConsoleReporter } from "../src/reporter/console";

async function executeTests() {
	const cwd = process.cwd();
	const testFiles = await glob("src/**/*.test.ts", { cwd, absolute: true });
	const reporter = new ConsoleReporter();

	const promises = testFiles.map(async file => {
		const worker = Bun.spawn({
			cmd: ["bun", "--preload", "./src/setup.ts", "./bin/run-test.ts", file],
			stdout: "pipe",
			stderr: "pipe",
		});

		const chunks = [];
		for await (const chunk of worker.stdout) {
			chunks.push(chunk);
		}
		const stdout = new TextDecoder().decode(Buffer.concat(chunks));

		const exitCode = await worker.exited;

		if (exitCode !== 0) {
			throw new Error(`Test worker for ${file} exited with code ${exitCode}`);
		}

		try {
			const result = JSON.parse(stdout);
			if (result.error) {
				throw new Error(`Error in test file ${file}: ${result.error}`);
			}
			result.results.forEach(res => reporter.addResult(res));
		} catch (e) {
			throw new Error(`Failed to parse test results from ${file}: ${e.message}`);
		}
	});

	await Promise.all(promises);

	reporter.printSummary();
}

executeTests().catch(error => {
	console.error(error);
	process.exit(1);
});
