import { Token } from "../types/token";
import { ParsedCommand } from "../types/parsed-command";
import { ParseError } from "./parser.service";
import { Effect } from "effect";

export const parseTokens = (tokens: Token[]): Effect.Effect<ParsedCommand, ParseError> =>
	Effect.gen(function*() {
		if (tokens.length === 0) {
			return yield* new ParseError({ message: "No tokens to parse" });
		}

		let currentIndex = 0;
		const parsedCommands: ParsedCommand[] = [];
		const redirects: ParsedCommand["redirects"] = [];
		const chains: ParsedCommand["chaining"] = [];
		const variables: Record<string, string> = {};

		while (currentIndex < tokens.length) {
			const token = tokens[currentIndex];

			if (token.type === "pipe") {
				currentIndex++;
				continue;
			}

			if (token.type === "redirect_in") {
				if (currentIndex + 1 >= tokens.length) {
					return yield* new ParseError({ message: "Missing file for input redirect" });
				}
				const fileToken = tokens[currentIndex + 1];
				redirects.push({
					type: "in",
					file: fileToken.value,
				});
				currentIndex += 2;
				continue;
			}

			if (token.type === "redirect_out") {
				if (currentIndex + 1 >= tokens.length) {
					return yield* new ParseError({ message: "Missing file for output redirect" });
				}
				const fileToken = tokens[currentIndex + 1];
				redirects.push({
					type: "out",
					file: fileToken.value,
				});
				currentIndex += 2;
				continue;
			}

			if (token.type === "redirect_append") {
				if (currentIndex + 1 >= tokens.length) {
					return yield* new ParseError({ message: "Missing file for append redirect" });
				}
				const fileToken = tokens[currentIndex + 1];
				redirects.push({
					type: "append",
					file: fileToken.value,
				});
				currentIndex += 2;
				continue;
			}

			if (token.type === "and" || token.type === "or" || token.type === "semicolon") {
				if (parsedCommands.length === 0) {
					return yield* new ParseError({ message: "Missing command before operator" });
				}
				const lastCommand = parsedCommands[parsedCommands.length - 1];
				chains.push({
					type: token.type,
					command: lastCommand.name,
				});
				currentIndex++;
				continue;
			}

			if (token.type === "variable") {
				const varName = token.value.replace("$", "");
				variables[varName] = process.env[varName] ?? "";
				currentIndex++;
				continue;
			}

			if (token.type === "command" || token.type === "string") {
				const name = token.value;
				const args: string[] = [];

				currentIndex++;
				while (currentIndex < tokens.length) {
					const nextToken = tokens[currentIndex];
					if (
						nextToken.type === "pipe" ||
						nextToken.type === "redirect_in" ||
						nextToken.type === "redirect_out" ||
						nextToken.type === "redirect_append" ||
						nextToken.type === "and" ||
						nextToken.type === "or" ||
						nextToken.type === "semicolon"
					) {
						break;
					}
					if (nextToken.type === "command" || nextToken.type === "string") {
						args.push(nextToken.value);
					}
					currentIndex++;
				}

				parsedCommands.push(
					ParsedCommand.make({
						name,
						args,
						redirects,
						chaining: chains,
						variables,
					}),
				);
				continue;
			}

			currentIndex++;
		}

		if (parsedCommands.length === 0) {
			return yield* new ParseError({ message: "No valid command found" });
		}

		return parsedCommands[0];
	});
