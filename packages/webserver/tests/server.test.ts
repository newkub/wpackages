import { type ChildProcess, spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const port = 30_000 + Math.floor(Math.random() * 10_000);
const BASE_URL = `http://localhost:${port}`;

const waitForServer = async () => {
	const startedAt = Date.now();
	while (Date.now() - startedAt < 10_000) {
		try {
			const res = await fetch(`${BASE_URL}/`);
			if (res.status === 200) return;
		} catch {
			// ignore until ready
		}
		await new Promise((r) => setTimeout(r, 100));
	}
	throw new Error("Server did not start in time");
};

describe("Server", () => {
	let proc: null | ChildProcess = null;

	beforeAll(async () => {
		const testDir = dirname(fileURLToPath(import.meta.url));
		const projectRoot = resolve(testDir, "..");
		proc = spawn("bun", ["run", "dev"], {
			cwd: projectRoot,
			env: {
				...process.env,
				PORT: String(port),
			},
			stdio: ["ignore", "ignore", "pipe"],
		});
		await waitForServer();
	});

	afterAll(() => {
		proc?.kill();
		proc = null;
	});

	it("should return 200 on /", async () => {
		const response = await fetch(`${BASE_URL}/`);
		expect(response.status).toBe(200);
		const text = await response.text();
		expect(text).toBe("Hello World");
	});

	it("should return JSON on /users/:id", async () => {
		const response = await fetch(`${BASE_URL}/users/1`);
		expect(response.status).toBe(200);
		const json = await response.json();
		expect(json).toEqual({ user: { id: 1, name: "John Doe" } });
	});

	it("should return 404 on unknown route", async () => {
		const response = await fetch(`${BASE_URL}/not-found`);
		expect(response.status).toBe(404);
	});
});
