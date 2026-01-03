import { prompt } from "../src/context";
import {
	confirm,
	date,
	multiselect,
	note,
	number,
	rating,
	select,
	slider,
	spinner as loadingSpinner,
	text,
	time,
	toggle,
} from "../src/index";

async function main() {
	console.clear();

	await prompt(note({ message: "Welcome to the @wrikka/prompt showcase!" }));

	const nameResult = await prompt(text({ message: "What is your name?" }));
	if (typeof nameResult === "symbol") return;
	const name = nameResult;

	const usePackageResult = await prompt(
		confirm({ message: `Nice to meet you, ${String(name)}! Are you enjoying this library?` }),
	);
	if (typeof usePackageResult === "symbol") return;
	const usePackage = usePackageResult;

	if (!usePackage) {
		await prompt(note({ message: "Oh, that's a shame. Goodbye!", type: "warning" }));
		return;
	}

	await prompt(
		select({
			message: "What is your favorite feature so far?",
			options: [
				{ value: "text", label: "Text Input" },
				{ value: "confirm", label: "Confirmation" },
				{ value: "select", label: "Select Menu" },
			],
		}),
	);

	await prompt(
		multiselect({
			message: "Which features would you like to see improved? (Space to select, Enter to submit)",
			options: [
				{ value: "more-components", label: "More Components" },
				{ value: "theming", label: "Theming" },
				{ value: "performance", label: "Performance" },
			],
		}),
	);

	await prompt(number({ message: "How old are you?", min: 18, max: 99 }));

	await prompt(slider({ message: "How satisfied are you?", max: 10 }));

	await prompt(toggle({ message: "Enable notifications?" }));

	await prompt(rating({ message: "Rate this project (out of 5 stars)" }));

	await prompt(date({ message: "Pick a release date for your project" }));

	await prompt(time({ message: "Schedule a follow-up meeting" }));

	await prompt(loadingSpinner({ message: "Saving your preferences..." }));

	await prompt(note({ message: "All done! Thank you for your feedback.", type: "success" }));
}

main().catch(console.error);
