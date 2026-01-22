import fs from "node:fs/promises";
import path from "node:path";
import { DEFAULT_CONFIG } from "./defaults";
import type { ConfigLoadOptions, ConfigLoadResult, ReporterConfig } from "./types";
import { validateConfig } from "./validator";

const CONFIG_FILES = [
	".reporterrc",
	".reporterrc.json",
	".reporterrc.ts",
	"reporter.config.ts",
];

function findUp(cwd: string, files: string[]): string | null {
	let current = cwd;
	const root = path.parse(current).root;

	while (current !== root) {
		for (const file of files) {
			const filePath = path.join(current, file);
			try {
				fs.accessSync(filePath);
				return filePath;
			} catch {
				continue;
			}
		}
		current = path.dirname(current);
	}

	return null;
}

async function loadJsonConfig(filePath: string): Promise<ReporterConfig> {
	const content = await fs.readFile(filePath, "utf-8");
	return JSON.parse(content) as ReporterConfig;
}

async function loadTsConfig(filePath: string): Promise<ReporterConfig> {
	const { default: config } = await import(filePath);
	return config as ReporterConfig;
}

export async function loadConfig(options: ConfigLoadOptions = {}): Promise<ConfigLoadResult> {
	const cwd = options.cwd ?? process.cwd();
	let configPath: string | null = null;
	let config: ReporterConfig = {};

	if (options.configPath) {
		configPath = path.resolve(cwd, options.configPath);
	} else {
		configPath = findUp(cwd, CONFIG_FILES);
	}

	if (configPath) {
		const ext = path.extname(configPath);
		if (ext === ".ts") {
			config = await loadTsConfig(configPath);
		} else {
			config = await loadJsonConfig(configPath);
		}
	}

	const mergedConfig = mergeConfigs(DEFAULT_CONFIG, config);
	validateConfig(mergedConfig);

	return {
		config: mergedConfig,
		configPath,
	};
}

function mergeConfigs(base: ReporterConfig, override: Partial<ReporterConfig>): ReporterConfig {
	return {
		...base,
		...override,
		severity: {
			...base.severity,
			...override.severity,
			exitCode: {
				...base.severity?.exitCode,
				...override.severity?.exitCode,
			},
		},
		filters: {
			...base.filters,
			...override.filters,
			include: {
				...base.filters?.include,
				...override.filters?.include,
			},
			exclude: {
				...base.filters?.exclude,
				...override.filters?.exclude,
			},
		},
		rules: {
			...base.rules,
			...override.rules,
			rules: {
				...base.rules?.rules,
				...override.rules?.rules,
			},
		},
		output: {
			...base.output,
			...override.output,
		},
	};
}
