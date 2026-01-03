import { Data } from "@wpackages/functional";

export class GitHubError extends Data.TaggedError("GitHubError")<{
	readonly reason: "fetch-error" | "json-parse-error" | "validation-error";
	readonly error: unknown;
}> {}

export class GitHubHttpError extends Data.TaggedError("GitHubHttpError")<{
	readonly status: number;
	readonly body: unknown;
}> {}

export class RateLimitError extends Data.TaggedError("RateLimitError")<{
	readonly reset: Date;
}> {}
