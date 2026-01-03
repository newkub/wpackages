import { prompt } from "../src/context";
import { multiselect } from "../src/index";

async function main() {
	const features = await prompt(
		multiselect({
			message: "Select features to improve:",
			options: [
				{ value: "theming", label: "Theming" },
				{ value: "performance", label: "Performance" },
			],
		}),
	);
	if (typeof features === "symbol") {
		console.log("Prompt cancelled.");
		return;
	}
	if (Array.isArray(features)) {
		console.log(`You selected: ${features.join(", ")}`);
	}
}

main().catch(console.error);
