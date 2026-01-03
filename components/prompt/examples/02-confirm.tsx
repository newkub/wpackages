import { prompt } from "../src/context";
import { confirm } from "../src/index";

async function main() {
	const confirmed = await prompt(confirm({ message: "Do you want to continue?" }));
	if (typeof confirmed === "symbol") {
		console.log("Prompt cancelled.");
		return;
	}
	console.log(`Confirmed: ${String(confirmed)}`);
}

main().catch(console.error);
