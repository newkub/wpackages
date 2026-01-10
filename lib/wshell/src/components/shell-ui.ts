import { HistoryEntry } from "../types/history";
import { CompletionItem } from "../types/completion";
import { DisplayUtils } from "./display.utils";

export class ShellUI {
	private historyIndex = -1;
	private currentInput = "";
	private history: HistoryEntry[] = [];
	private suggestions: CompletionItem[] = [];

	setHistory(history: HistoryEntry[]): void {
		this.history = history;
		this.historyIndex = history.length;
	}

	setSuggestions(suggestions: CompletionItem[]): void {
		this.suggestions = suggestions;
	}

	navigateHistory(direction: "up" | "down"): string {
		if (direction === "up" && this.historyIndex > 0) {
			this.historyIndex--;
			return this.history[this.historyIndex].command;
		}
		if (direction === "down" && this.historyIndex < this.history.length - 1) {
			this.historyIndex++;
			return this.history[this.historyIndex].command;
		}
		return this.currentInput;
	}

	setCurrentInput(input: string): void {
		this.currentInput = input;
	}

	getCurrentInput(): string {
		return this.currentInput;
	}

	renderPrompt(cwd: string, promptStyle: string): void {
		const formattedPrompt = DisplayUtils.formatPrompt(promptStyle, cwd);
		process.stdout.write(formattedPrompt);
	}

	renderSuggestions(): void {
		if (this.suggestions.length === 0) return;

		DisplayUtils.moveCursorUp(1);
		DisplayUtils.clearLine();

		const suggestions = this.suggestions.slice(0, 5).map((item) => DisplayUtils.formatCompletionItem(item));
		process.stdout.write(suggestions.join("  "));
	}

	renderHistory(): void {
		if (this.history.length === 0) {
			console.log("No history yet");
			return;
		}

		console.log("Command history:");
		this.history.forEach((entry) => {
			console.log(DisplayUtils.formatHistoryEntry(entry));
		});
	}
}
