import { prompt } from "../src/context";
import { date as datePrompt } from "../src/index";

async function main() {
	const selectedDate = await prompt(datePrompt({ message: "Select a date:" }));
	if (typeof selectedDate === "symbol") {
		console.log("Prompt cancelled.");
		return;
	}
	console.log(`Selected date: ${selectedDate.toDateString()}`);
}

main().catch(console.error);
