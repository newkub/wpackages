import { Effect } from "effect";

export class InputUtils {
	static async readLine(prompt: string): Promise<string> {
		process.stdout.write(prompt);
		const buffer = Buffer.alloc(1024);
		const bytesRead = await process.stdin.read(buffer);
		if (!bytesRead) return "";
		return buffer.toString("utf-8", 0, bytesRead).trim();
	}

	static async readPassword(prompt: string): Promise<string> {
		process.stdout.write(prompt);
		const buffer = Buffer.alloc(1024);
		const bytesRead = await process.stdin.read(buffer);
		if (!bytesRead) return "";
		return buffer.toString("utf-8", 0, bytesRead).trim();
	}

	static async readChar(): Promise<string> {
		const buffer = Buffer.alloc(1);
		const bytesRead = await process.stdin.read(buffer);
		if (!bytesRead) return "";
		return buffer.toString("utf-8", 0, bytesRead);
	}

	static async confirm(prompt: string): Promise<boolean> {
		const answer = await this.readLine(`${prompt} (y/n): `);
		return answer.toLowerCase() === "y" || answer.toLowerCase() === "yes";
	}

	static async select(prompt: string, options: string[]): Promise<number> {
		console.log(prompt);
		options.forEach((opt, i) => console.log(`  ${i + 1}. ${opt}`));

		while (true) {
			const answer = await this.readLine("Select option: ");
			const index = parseInt(answer, 10);
			if (index >= 1 && index <= options.length) {
				return index - 1;
			}
			console.log("Invalid option, please try again.");
		}
	}

	static setupRawMode(): Effect.Effect<() => void, never> {
		return Effect.sync(() => {
			const stdin = process.stdin;
			stdin.setRawMode(true);
			stdin.resume();
			stdin.setEncoding("utf-8");

			return () => {
				stdin.setRawMode(false);
				stdin.pause();
			};
		});
	}
}
