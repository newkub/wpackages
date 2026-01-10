import { describe, expect, it, vi } from "vitest";
import { command } from "./command";

describe("command", () => {
	it("should execute command", () => {
		const execute = vi.fn(() => "executed");
		const cmd = command(execute);

		const result = cmd.execute();

		expect(result).toBe("executed");
		expect(execute).toHaveBeenCalledTimes(1);
	});

	it("should undo command", () => {
		const execute = vi.fn(() => "executed");
		const undo = vi.fn();
		const cmd = command(execute, undo);

		cmd.execute();
		cmd.undo();

		expect(execute).toHaveBeenCalledTimes(1);
		expect(undo).toHaveBeenCalledTimes(1);
	});

	it("should have default no-op undo", () => {
		const execute = vi.fn(() => "executed");
		const cmd = command(execute);

		cmd.execute();
		expect(() => cmd.undo()).not.toThrow();
	});
});
