import * as p from "@clack/prompts";
import pc from "picocolors";
import { format } from "./services/formatter.service";

export const runFormatterApp = async () => {
	const args = process.argv.slice(2);
	let engine: "auto" | "dprint" | "biome" = "auto";
	let check = false;
	let cwd: string | undefined;
	let configPath: string | undefined;
	const pathsToFormat: string[] = [];

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg === "--check") {
			check = true;
			continue;
		}

		if (arg.startsWith("--engine=")) {
			engine = (arg.split("=")[1] as typeof engine) ?? "auto";
			continue;
		}
		if (arg === "--engine") {
			engine = (args[i + 1] as typeof engine) ?? "auto";
			i++;
			continue;
		}

		if (arg.startsWith("--cwd=")) {
			cwd = arg.split("=")[1];
			continue;
		}
		if (arg === "--cwd") {
			cwd = args[i + 1];
			i++;
			continue;
		}

		if (arg.startsWith("--config=")) {
			configPath = arg.split("=")[1];
			continue;
		}
		if (arg === "--config") {
			configPath = args[i + 1];
			i++;
			continue;
		}

		if (arg.startsWith("--")) continue;
		pathsToFormat.push(arg);
	}

	if (pathsToFormat.length === 0) pathsToFormat.push(".");

	p.intro(pc.cyan("✨ formatter"));

	const s = p.spinner();
	s.start(
		`${check ? "Checking" : "Formatting"} ${pathsToFormat.join(" ")}...`,
	);

	try {
		await format(pathsToFormat, { engine, check, cwd, configPath });
		s.stop(check ? "✅ Check complete." : "✅ Formatting complete.");
	} catch (error) {
		s.stop("❌ Formatting failed.");
		p.log.error(error instanceof Error ? error.message : String(error));
		process.exit(1);
	}

	p.outro(pc.green("All done! ✨"));
};
