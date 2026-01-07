import { describe, expect, it } from "vitest";
import { createHooks } from "./hooks";

describe("vitext-kit/createHooks", () => {
	it("emits hooks in registration order", async () => {
		type Hooks = {
			ready: (value: number) => void | Promise<void>;
		};

		const hooks = createHooks<Hooks>();
		const calls: number[] = [];

		hooks.on("ready", async (value) => {
			calls.push(value);
		});
		hooks.on("ready", (value) => {
			calls.push(value + 1);
		});

		await hooks.emit("ready", 1);

		expect(calls).toEqual([1, 2]);
	});
});
