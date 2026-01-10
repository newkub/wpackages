import { describe, expect, it } from "bun:test";
import { DisplayUtils } from "../components/display.utils";

describe("DisplayUtils", () => {
	it("should format prompt", () => {
		const result = DisplayUtils.formatPrompt(">", "/home/user");
		expect(result).toBe("/home/user >");
	});

	it("should format history entry", () => {
		const entry = {
			index: 1,
			command: "ls -la",
			timestamp: Date.now(),
		};
		const result = DisplayUtils.formatHistoryEntry(entry);
		expect(result).toContain("1");
		expect(result).toContain("ls -la");
	});

	it("should format completion item", () => {
		const item = {
			label: "ls",
			description: "List files",
			type: "command",
		};
		const result = DisplayUtils.formatCompletionItem(item);
		expect(result).toContain("ls");
		expect(result).toContain("[command]");
	});

	it("should format table", () => {
		const data = [
			{ name: "file1.txt", size: 1024 },
			{ name: "file2.txt", size: 2048 },
		];
		const result = DisplayUtils.formatTable(data);
		expect(result).toContain("name");
		expect(result).toContain("size");
	});

	it("should format error", () => {
		const error = new Error("Test error");
		const result = DisplayUtils.formatError(error);
		expect(result).toContain("Error");
		expect(result).toContain("Test error");
	});

	it("should format success", () => {
		const result = DisplayUtils.formatSuccess("Success!");
		expect(result).toContain("Success!");
	});

	it("should format info", () => {
		const result = DisplayUtils.formatInfo("Info");
		expect(result).toContain("Info");
	});

	it("should format warning", () => {
		const result = DisplayUtils.formatWarning("Warning");
		expect(result).toContain("Warning");
	});
});
