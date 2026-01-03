import { prompt } from "../src/context";
import { select } from "../src/index";

async function main() {
	const feature = await prompt(
		select({
			message: "Select your favorite feature:",
			options: [
				{ value: "text", label: "Text Input" },
				{ value: "confirm", label: "Confirmation" },
			],
		}),
	);
	if (typeof feature === "symbol") {
		console.log("Prompt cancelled.");
		return;
	}
	console.log(`You selected: ${String(feature)}`);
}

main().catch(console.error);
