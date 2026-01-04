#!/usr/bin/env bun
import { run } from "../src/services/runner/main";

run().catch(error => {
	console.error("An unexpected error occurred:", error);
	process.exit(1);
});
