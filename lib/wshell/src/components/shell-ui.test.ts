import { describe, expect, it } from "bun:test";
import { ShellUI } from "../components/shell-ui";
import { HistoryEntry } from "../types/history";
import { CompletionItem } from "../types/completion";

describe("ShellUI", () => {
	it("should set and get current input", () => {
		const ui = new ShellUI();
		ui.setCurrentInput("test command");
		expect(ui.getCurrentInput()).toBe("test command");
	});

	it("should navigate history up", () => {
		const ui = new ShellUI();
		const history: HistoryEntry[] = [
			HistoryEntry.make({ command: "cmd1", timestamp: Date.now(), index: 0 }),
			HistoryEntry.make({ command: "cmd2", timestamp: Date.now(), index: 1 }),
		];
		ui.setHistory(history);
		ui.setCurrentInput("");

		const result = ui.navigateHistory("up");
		expect(result).toBe("cmd2");
	});

	it("should navigate history down", () => {
		const ui = new ShellUI();
		const history: HistoryEntry[] = [
			HistoryEntry.make({ command: "cmd1", timestamp: Date.now(), index: 0 }),
			HistoryEntry.make({ command: "cmd2", timestamp: Date.now(), index: 1 }),
		];
		ui.setHistory(history);
		ui.setCurrentInput("");

		ui.navigateHistory("up");
		const result = ui.navigateHistory("down");
		expect(result).toBe("cmd1");
	});

	it("should set suggestions", () => {
		const ui = new ShellUI();
		const suggestions: CompletionItem[] = [
			CompletionItem.make({ label: "ls", type: "command", description: "List files", value: "ls" }),
		];
		ui.setSuggestions(suggestions);
	});
});
