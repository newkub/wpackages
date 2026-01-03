import { prompt } from "../src/context";
import { text } from "../src/index";

async function main() {
	const name = await prompt(text({ message: "What is your name?" }));
	if (typeof name === "symbol") {
		console.log("Prompt cancelled.");
		return;
	}
	console.log(`Hello, ${String(name)}!`);
}

main().catch(console.error);
