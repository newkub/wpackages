#!/usr/bin/env node
import { runFormatterApp } from "../app";

runFormatterApp(process.argv.slice(2)).catch((error) => {
	console.error(error);
	process.exit(1);
});
