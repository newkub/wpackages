import { Loader } from "../src/index";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function successfulOperation() {
	await sleep(2000);
	return "Success!";
}

async function failedOperation() {
	await sleep(2000);
	throw new Error("Something went wrong");
}

async function main() {
	await Loader.promise(successfulOperation(), "Running successful operation...");

	try {
		await Loader.promise(failedOperation(), { text: "Running failed operation...", color: "yellow" });
	} catch (error) {
		// The error is re-thrown, so we can catch it here.
		console.error("Caught expected error:", (error as Error).message);
	}
}

main();
