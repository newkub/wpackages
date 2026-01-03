import { prompt } from "../src/context";
import { slider } from "../src/index";

async function main() {
	const value = await prompt(slider({ message: "Select a value:" }));
	if (typeof value === "symbol") {
		console.log("Prompt cancelled.");
		return;
	}
	console.log(`Value: ${String(value)}`);
}

main().catch(console.error);
