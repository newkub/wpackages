import { Effect, Layer } from "@wpackages/functional";
import type { Effect as EffectType } from "@wpackages/functional";
import type { z } from "zod";
import { makeGitHub } from "./client";
import type { GitHubError, GitHubHttpError } from "./errors";
import type { Issue, Repo, User } from "./schema";
import type { CreateIssueOptions, GitHub, PaginationOptions, RequestOptions } from "./types";

export const GitHub = Effect.tag<GitHub>();

const envToken = process.env["GITHUB_TOKEN"];
export const GitHubLive = Layer.succeed(GitHub, makeGitHub(envToken ? { token: envToken } : {}));

export const request = <A>(
	path: string,
	schema: z.ZodSchema<A>,
	options?: RequestOptions,
): EffectType<A, GitHubError | GitHubHttpError, GitHub> =>
	Effect.gen(function*() {
		const svc = yield* Effect.get(GitHub);
		return yield* svc.request(path, schema, options);
	});

export const getRepo = (owner: string, repo: string): EffectType<Repo, GitHubError | GitHubHttpError, GitHub> =>
	Effect.gen(function*() {
		const svc = yield* Effect.get(GitHub);
		return yield* svc.getRepo(owner, repo);
	});

export const getUser = (username: string): EffectType<User, GitHubError | GitHubHttpError, GitHub> =>
	Effect.gen(function*() {
		const svc = yield* Effect.get(GitHub);
		return yield* svc.getUser(username);
	});

export const listUserRepos = (
	username: string,
	options?: PaginationOptions,
): EffectType<Repo[], GitHubError | GitHubHttpError, GitHub> =>
	Effect.gen(function*() {
		const svc = yield* Effect.get(GitHub);
		return yield* svc.listUserRepos(username, options);
	});

export const createIssue = (
	owner: string,
	repo: string,
	title: string,
	options?: CreateIssueOptions,
): EffectType<Issue, GitHubError | GitHubHttpError, GitHub> =>
	Effect.gen(function*() {
		const svc = yield* Effect.get(GitHub);
		return yield* svc.createIssue(owner, repo, title, options);
	});
