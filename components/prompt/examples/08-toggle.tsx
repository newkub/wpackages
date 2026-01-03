import { prompt } from "../src/context";
import { toggle } from "../src/index";

async function main() {
	const enabled = await prompt(toggle({ message: "Enable feature?" }));
	if (typeof enabled === "symbol") {
		console.log("Prompt cancelled.");
		return;
	}
	console.log(`Feature enabled: ${String(enabled)}`);
}

main().catch(console.error);
