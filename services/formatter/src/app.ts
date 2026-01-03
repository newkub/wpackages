import * as p from "@clack/prompts";
import pc from "picocolors";
import { defineCommand, runMain } from "citty";
import { format } from "./services/formatter.service";
import { ProcessError } from "./utils";

const main = defineCommand({
	meta: {
		name: "wformat",
		version: "0.1.0",
		description: "Format code using dprint or biome",
	},
	args: {
		check: {
			type: "boolean",
			description: "Check for formatting issues without writing changes",
		},
		engine: {
			type: "string",
			description: 'The formatting engine to use ("auto", "dprint", "biome")',
			default: "auto",
		},
		cwd: {
			type: "string",
			description: "The working directory to run in",
		},
		config: {
			type: "string",
			description: "Path to the configuration file",
		},
		paths: {
			type: "string",
			isDefault: true,
			description: "Paths to format (default: .)",
			default: ".",
		},
	},
	async run({ args }) {
		const pathsToFormat = Array.isArray(args.paths) ? args.paths : [args.paths];

		p.intro(pc.cyan("✨ formatter"));

		const s = p.spinner();
		s.start(
			`${args.check ? "Checking" : "Formatting"} ${pathsToFormat.join(" ")}...`,
		);

		try {
			await format(pathsToFormat, {
				engine: args.engine as "auto" | "dprint" | "biome",
				check: args.check,
				cwd: args.cwd,
				configPath: args.config,
			});
			s.stop(args.check ? "✅ Check complete." : "✅ Formatting complete.");
		} catch (error) {
			s.stop("❌ Formatting failed.");
			if (error instanceof ProcessError) {
				p.log.error(error.message);
				if (error.stdout) p.log.info(error.stdout);
				if (error.stderr) p.log.error(error.stderr);
			} else {
				p.log.error(error instanceof Error ? error.message : String(error));
			}
			process.exit(1);
		}

		p.outro(pc.green("All done! ✨"));
	},
});

export const runFormatterApp = async (argv: string[]) => {
	await runMain(main, { argv });
};

