import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import { tokenize } from "../utils/tokenizer";

describe("Tokenizer", () => {
	it("should tokenize simple command", async () => {
		const result = await Effect.runPromise(tokenize("ls -la"));
		expect(result).toHaveLength(2);
		expect(result[0].type).toBe("command");
		expect(result[0].value).toBe("ls");
		expect(result[1].type).toBe("command");
		expect(result[1].value).toBe("-la");
	});

	it("should tokenize pipe", async () => {
		const result = await Effect.runPromise(tokenize("ls | grep test"));
		expect(result).toHaveLength(3);
		expect(result[1].type).toBe("pipe");
		expect(result[1].value).toBe("|");
	});

	it("should tokenize redirect", async () => {
		const result = await Effect.runPromise(tokenize("ls > output.txt"));
		expect(result).toHaveLength(3);
		expect(result[1].type).toBe("redirect_out");
		expect(result[2].value).toBe("output.txt");
	});

	it("should tokenize variables", async () => {
		const result = await Effect.runPromise(tokenize("echo $HOME"));
		expect(result).toHaveLength(2);
		expect(result[1].type).toBe("variable");
		expect(result[1].value).toBe("$HOME");
	});

	it("should tokenize strings", async () => {
		const result = await Effect.runPromise(tokenize('echo "hello world"'));
		expect(result).toHaveLength(2);
		expect(result[1].type).toBe("string");
		expect(result[1].value).toBe("hello world");
	});

	it("should tokenize chaining operators", async () => {
		const result = await Effect.runPromise(tokenize("ls && echo done"));
		expect(result).toHaveLength(3);
		expect(result[1].type).toBe("and");
		expect(result[1].value).toBe("&&");
	});
});
