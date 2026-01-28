import type { ValidationError } from "../../../types/core";

type PushIssueOptions = {
	prefixPath: string[];
	error: ValidationError;
	fallbackMessage?: string;
	fallbackCode?: string;
};

export function pushIssues(errors: ValidationError[], options: PushIssueOptions): void {
	const { prefixPath, error, fallbackMessage, fallbackCode } = options;
	const issues = error.issues;

	if (issues && issues.length > 0) {
		for (const issue of issues) {
			errors.push({
				...issue,
				path: [...prefixPath, ...issue.path],
			});
		}
		return;
	}

	errors.push({
		path: prefixPath,
		message: fallbackMessage ?? error.message,
		code: fallbackCode ?? error.code,
	});
}
