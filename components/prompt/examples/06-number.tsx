import { prompt } from "../src/context";
import { number } from "../src/index";

async function main() {
	const age = await prompt(number({ message: "How old are you?", min: 18 }));
	if (typeof age === "symbol") {
		console.log("Prompt cancelled.");
		return;
	}
	console.log(`Your age: ${String(age)}`);
}

main().catch(console.error);
