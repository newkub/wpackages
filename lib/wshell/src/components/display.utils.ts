import { Effect } from "effect";

export class DisplayUtils {
	static formatPrompt(prompt: string, cwd: string): string {
		return `${cwd} ${prompt}`;
	}

	static formatHistoryEntry(entry: { index: number; command: string; timestamp: number }): string {
		const date = new Date(entry.timestamp).toLocaleTimeString();
		return `  ${entry.index}  ${date}  ${entry.command}`;
	}

	static formatCompletionItem(item: { label: string; description?: string; type?: string }): string {
		const type = item.type ? `[${item.type}]` : "";
		const desc = item.description ? ` - ${item.description}` : "";
		return `${item.label} ${type}${desc}`;
	}

	static formatTable(data: Array<Record<string, unknown>>): string {
		if (data.length === 0) return "";

		const keys = Object.keys(data[0]);
		const widths = keys.map((key) => Math.max(key.length, ...data.map((row) => String(row[key]).length)));

		const header = keys.map((key, i) => key.padEnd(widths[i])).join("  ");
		const separator = widths.map((w) => "-".repeat(w)).join("  ");

		const rows = data.map((row) =>
			keys.map((key, i) => String(row[key]).padEnd(widths[i])).join("  "),
		);

		return [header, separator, ...rows].join("\n");
	}

	static formatError(error: Error): string {
		return `\x1b[31mError: ${error.message}\x1b[0m`;
	}

	static formatSuccess(message: string): string {
		return `\x1b[32m${message}\x1b[0m`;
	}

	static formatInfo(message: string): string {
		return `\x1b[36m${message}\x1b[0m`;
	}

	static formatWarning(message: string): string {
		return `\x1b[33m${message}\x1b[0m`;
	}

	static clearScreen(): Effect.Effect<void, never> {
		return Effect.sync(() => {
			process.stdout.write("\x1b[2J\x1b[0f");
		});
	}

	static moveCursorUp(lines: number): Effect.Effect<void, never> {
		return Effect.sync(() => {
			process.stdout.write(`\x1b[${lines}A`);
		});
	}

	static clearLine(): Effect.Effect<void, never> {
		return Effect.sync(() => {
			process.stdout.write("\x1b[2K\r");
		});
	}
}
