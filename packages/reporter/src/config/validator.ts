import type { ReporterConfig, SeverityLevel } from "./types";

const VALID_FORMATS = ["text", "json", "sarif"] as const;
const VALID_SEVERITY_LEVELS = ["error", "warning", "info", "hint"] as const;
const VALID_GROUP_BY = ["file", "rule", "severity", "none"] as const;

type ConfigValidationErrorItem = {
	path: string;
	message: string;
	value: unknown;
};

export class ConfigValidationError extends Error {
	constructor(public errors: ConfigValidationErrorItem[]) {
		super(`Config validation failed with ${errors.length} error(s)`);
		this.name = "ConfigValidationError";
	}
}

function validateSeverityLevel(value: unknown): value is SeverityLevel {
	return typeof value === "string" && VALID_SEVERITY_LEVELS.includes(value as SeverityLevel);
}

function validateSeverityConfig(config: unknown, path: string = "severity"): ConfigValidationErrorItem[] {
	const errors: ConfigValidationErrorItem[] = [];

	if (!config || typeof config !== "object") {
		return errors;
	}

	const severityConfig = config as Record<string, unknown>;

	if (severityConfig["minLevel"] !== undefined) {
		if (!validateSeverityLevel(severityConfig["minLevel"])) {
			errors.push({
				path: `${path}.minLevel`,
				message: `Must be one of: ${VALID_SEVERITY_LEVELS.join(", ")}`,
				value: severityConfig["minLevel"],
			});
		}
	}

	if (severityConfig["exitCode"] !== undefined) {
		if (!severityConfig["exitCode"] || typeof severityConfig["exitCode"] !== "object") {
			errors.push({
				path: `${path}.exitCode`,
				message: "Must be an object",
				value: severityConfig["exitCode"],
			});
		} else {
			const exitCode = severityConfig["exitCode"] as Record<string, unknown>;
			for (const [key, value] of Object.entries(exitCode)) {
				if (typeof value !== "number" || value < 0 || value > 255) {
					errors.push({
						path: `${path}.exitCode.${key}`,
						message: "Must be a number between 0 and 255",
						value,
					});
				}
			}
		}
	}

	return errors;
}

function validateFilterConfig(config: unknown, path: string = "filters"): ConfigValidationErrorItem[] {
	const errors: ConfigValidationErrorItem[] = [];

	if (!config || typeof config !== "object") {
		return errors;
	}

	const filterConfig = config as Record<string, unknown>;

	for (const key of ["include", "exclude"] as const) {
		if (filterConfig[key] !== undefined) {
			if (!filterConfig[key] || typeof filterConfig[key] !== "object") {
				errors.push({
					path: `${path}.${key}`,
					message: "Must be an object",
					value: filterConfig[key],
				});
			} else {
				const subConfig = filterConfig[key] as Record<string, unknown>;
				for (const [subKey, value] of Object.entries(subConfig)) {
					if (!Array.isArray(value)) {
						errors.push({
							path: `${path}.${key}.${subKey}`,
							message: "Must be an array",
							value,
						});
					}
				}
			}
		}
	}

	return errors;
}

function validateOutputConfig(config: unknown, path: string = "output"): ConfigValidationErrorItem[] {
	const errors: ConfigValidationErrorItem[] = [];

	if (!config || typeof config !== "object") {
		return errors;
	}

	const outputConfig = config as Record<string, unknown>;

	if (outputConfig["groupBy"] !== undefined) {
		if (!VALID_GROUP_BY.includes(outputConfig["groupBy"] as never)) {
			errors.push({
				path: `${path}.groupBy`,
				message: `Must be one of: ${VALID_GROUP_BY.join(", ")}`,
				value: outputConfig["groupBy"],
			});
		}
	}

	if (outputConfig["colors"] !== undefined && typeof outputConfig["colors"] !== "boolean") {
		errors.push({
			path: `${path}.colors`,
			message: "Must be a boolean",
			value: outputConfig["colors"],
		});
	}

	if (outputConfig["icons"] !== undefined && typeof outputConfig["icons"] !== "boolean") {
		errors.push({
			path: `${path}.icons`,
			message: "Must be a boolean",
			value: outputConfig["icons"],
		});
	}

	if (outputConfig["showSummary"] !== undefined && typeof outputConfig["showSummary"] !== "boolean") {
		errors.push({
			path: `${path}.showSummary`,
			message: "Must be a boolean",
			value: outputConfig["showSummary"],
		});
	}

	if (outputConfig["showStats"] !== undefined && typeof outputConfig["showStats"] !== "boolean") {
		errors.push({
			path: `${path}.showStats`,
			message: "Must be a boolean",
			value: outputConfig["showStats"],
		});
	}

	return errors;
}

export function validateConfig(config: ReporterConfig): void {
	const errors: ConfigValidationErrorItem[] = [];

	if (config.format !== undefined && !VALID_FORMATS.includes(config.format)) {
		errors.push({
			path: "format",
			message: `Must be one of: ${VALID_FORMATS.join(", ")}`,
			value: config.format,
		});
	}

	if (config.outputFile !== undefined && typeof config.outputFile !== "string") {
		errors.push({
			path: "outputFile",
			message: "Must be a string",
			value: config.outputFile,
		});
	}

	if (config.cwd !== undefined && typeof config.cwd !== "string") {
		errors.push({
			path: "cwd",
			message: "Must be a string",
			value: config.cwd,
		});
	}

	errors.push(...validateSeverityConfig(config.severity));
	errors.push(...validateFilterConfig(config.filters));
	errors.push(...validateOutputConfig(config.output));

	if (errors.length > 0) {
		throw new ConfigValidationError(errors);
	}
}
