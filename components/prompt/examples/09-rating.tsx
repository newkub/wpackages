import { prompt } from "../src/context";
import { rating } from "../src/index";

async function main() {
	const ratingValue = await prompt(rating({ message: "Rate this library:" }));
	if (typeof ratingValue === "symbol") {
		console.log("Prompt cancelled.");
		return;
	}
	console.log(`Your rating: ${String(ratingValue)}`);
}

main().catch(console.error);
