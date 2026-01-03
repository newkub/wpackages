import { Effect } from "@wpackages/functional";
import { z } from "zod";
import { GitHubError, GitHubHttpError, RateLimitError } from "./errors";
import { IssueSchema, RepoSchema, UserSchema } from "./schema";
import type { GitHub, GitHubRequestOptions, PaginationOptions, RequestOptions } from "./types";

const buildHeaders = (
	opts: Required<Pick<GitHubRequestOptions, "userAgent">> & { readonly token?: string | undefined },
	init?: RequestInit,
): Headers => {
	const headers = new Headers(init?.headers);
	headers.set("Accept", "application/vnd.github+json");
	headers.set("User-Agent", opts.userAgent);
	if (opts.token) {
		headers.set("Authorization", `Bearer ${opts.token}`);
	}
	return headers;
};

const defaultBaseUrl = "https://api.github.com";
const defaultUserAgent = "@wts/github";

export const makeGitHub = (options: GitHubRequestOptions = {}): GitHub => {
	const baseUrl = options.baseUrl ?? defaultBaseUrl;
	const token = options.token;
	const userAgent = options.userAgent ?? defaultUserAgent;

	const request = <A>(path: string, schema: z.ZodSchema<A>, options: RequestOptions = {}) => {
		const { body, ...rest } = options;
		const headers = new Headers(rest.headers);
		if (body !== undefined) {
			headers.set("Content-Type", "application/json");
		}

		const init: RequestInit = {
			...rest,
			headers,
			...(body !== undefined ? { body: JSON.stringify(body) } : {}),
		};

		const effect = Effect.fromPromise(async () => {
			const url = new URL(path, baseUrl);
			const res = await fetch(url, {
				...init,
				headers: buildHeaders({ userAgent, token }, init),
			});

			if (res.headers.get("x-ratelimit-remaining") === "0" && res.status === 403) {
				const reset = res.headers.get("x-ratelimit-reset");
				const resetDate = reset ? new Date(Number(reset) * 1000) : new Date(Date.now() + 60000);
				throw new RateLimitError({ reset: resetDate });
			}

			if (!res.ok) {
				const resBody = await res.text().catch(() => "");
				throw new GitHubHttpError({ status: res.status, body: resBody });
			}

			if (res.status === 204) {
				return null;
			}

			const json = await res.json();
			return schema.parse(json);
		}).pipe(
			Effect.mapError((error: unknown) => {
				if (error instanceof RateLimitError || error instanceof GitHubHttpError) {
					return error;
				}
				if (error instanceof z.ZodError) {
					return new GitHubError({ reason: "validation-error", error });
				}
				return new GitHubError({ reason: "fetch-error", error });
			}),
		);

		return effect.pipe(
			Effect.retry(
				Effect.Schedule.recurWhile((error) => error instanceof RateLimitError).pipe(
					Effect.Schedule.map((error) => new Date().getTime() - error.reset.getTime()),
				),
			),
		);
	};

	return {
		request,
		getRepo: (owner, repo) => request(`/repos/${owner}/${repo}`, RepoSchema),
		getUser: (username) => request(`/users/${username}`, UserSchema),
		listUserRepos: (username: string, options: PaginationOptions = {}) => {
			const searchParams = new URLSearchParams();
			if (options.page) {
				searchParams.set("page", String(options.page));
			}
			if (options.per_page) {
				searchParams.set("per_page", String(options.per_page));
			}
			const queryString = searchParams.toString();
			const path = `/users/${username}/repos${queryString ? `?${queryString}` : ""}`;
			return request(path, z.array(RepoSchema));
		},
		createIssue: (owner, repo, title, options = {}) => {
			const body = { title, ...options };
			return request(`/repos/${owner}/${repo}/issues`, IssueSchema, {
				method: "POST",
				body,
			});
		},
	};
};
