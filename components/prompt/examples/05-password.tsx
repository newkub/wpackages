import { prompt } from "../src/context";
import { password } from "../src/index";

async function main() {
	const result = await prompt(password({ message: "Enter your password:" }));
	if (typeof result === "symbol") {
		console.log("Prompt cancelled.");
		return;
	}
	console.log("Password received.");
}

main().catch(console.error);
