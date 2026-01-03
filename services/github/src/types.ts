import type { Effect as EffectType } from "@wpackages/functional";
import type { z } from "zod";
import type { GitHubError, GitHubHttpError, RateLimitError } from "./errors";
import type { Issue, Repo, User } from "./schema";

export interface GitHubRequestOptions {
	readonly token?: string;
	readonly baseUrl?: string;
	readonly userAgent?: string;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
	readonly body?: unknown;
}

export interface PaginationOptions {
	readonly page?: number;
	readonly per_page?: number;
}

export interface CreateIssueOptions {
	readonly body?: string;
	readonly labels?: ReadonlyArray<string>;
	readonly assignees?: ReadonlyArray<string>;
}

export interface GitHub {
	readonly request: <A>(
		path: string,
		schema: z.ZodSchema<A>,
		options?: RequestOptions,
	) => EffectType<A, GitHubError | GitHubHttpError | RateLimitError, never>;
	readonly getRepo: (
		owner: string,
		repo: string,
	) => EffectType<Repo, GitHubError | GitHubHttpError | RateLimitError, never>;
	readonly getUser: (username: string) => EffectType<User, GitHubError | GitHubHttpError | RateLimitError, never>;
	readonly listUserRepos: (
		username: string,
		options?: PaginationOptions,
	) => EffectType<Repo[], GitHubError | GitHubHttpError | RateLimitError, never>;
	readonly createIssue: (
		owner: string,
		repo: string,
		title: string,
		options?: CreateIssueOptions,
	) => EffectType<Issue, GitHubError | GitHubHttpError | RateLimitError, never>;
}
