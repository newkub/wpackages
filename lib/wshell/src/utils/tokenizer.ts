import { Token } from "../types/token";
import { Effect } from "effect";

export const tokenize = (input: string): Effect.Effect<Token[], never> =>
	Effect.sync(() => {
		const tokens: Token[] = [];
		let position = 0;

		while (position < input.length) {
			const char = input[position];

			if (/\s/.test(char)) {
				position++;
				continue;
			}

			if (char === "|") {
				tokens.push(
					Token.make({
						type: "pipe",
						value: "|",
						position: [position, position + 1],
					}),
				);
				position++;
				continue;
			}

			if (char === "<") {
				tokens.push(
					Token.make({
						type: "redirect_in",
						value: "<",
						position: [position, position + 1],
					}),
				);
				position++;
				continue;
			}

			if (char === ">") {
				if (input[position + 1] === ">") {
					tokens.push(
						Token.make({
							type: "redirect_append",
							value: ">>",
							position: [position, position + 2],
						}),
					);
					position += 2;
				} else {
					tokens.push(
						Token.make({
							type: "redirect_out",
							value: ">",
							position: [position, position + 1],
						}),
					);
					position++;
				}
				continue;
			}

			if (char === "&" && input[position + 1] === "&") {
				tokens.push(
					Token.make({
						type: "and",
						value: "&&",
						position: [position, position + 2],
					}),
				);
				position += 2;
				continue;
			}

			if (char === "|" && input[position + 1] === "|") {
				tokens.push(
					Token.make({
						type: "or",
						value: "||",
						position: [position, position + 2],
					}),
				);
				position += 2;
				continue;
			}

			if (char === ";") {
				tokens.push(
					Token.make({
						type: "semicolon",
						value: ";",
						position: [position, position + 1],
					}),
				);
				position++;
				continue;
			}

			if (char === "$") {
				let varName = "";
				let varPos = position;
				position++;
				while (position < input.length && /[\w]/.test(input[position])) {
					varName += input[position];
					position++;
				}
				tokens.push(
					Token.make({
						type: "variable",
						value: `$${varName}`,
						position: [varPos, position],
					}),
				);
				continue;
			}

			if (char === '"' || char === "'") {
				const quote = char;
				let strValue = "";
				let strPos = position;
				position++;
				while (position < input.length && input[position] !== quote) {
					strValue += input[position];
					position++;
				}
				position++;
				tokens.push(
					Token.make({
						type: "string",
						value: strValue,
						position: [strPos, position],
					}),
				);
				continue;
			}

			let word = "";
			let wordPos = position;
			while (position < input.length && !/[|\s<>;&]/.test(input[position])) {
				word += input[position];
				position++;
			}

			if (word) {
				tokens.push(
					Token.make({
						type: "command",
						value: word,
						position: [wordPos, position],
					}),
				);
			}
		}

		return tokens;
	});
