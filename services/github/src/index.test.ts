import { Effect } from "@wpackages/functional";
import { afterEach, describe, expect, test, vi } from "vitest";
import { makeGitHub } from "./client";
import { GitHubError, GitHubHttpError } from "./errors";
import { getRepo, GitHubLive } from "./service";

const mockRepo = {
	id: 1,
	node_id: "MDEwOlJlcG9zaXRvcnkx",
	name: "test-repo",
	full_name: "test-owner/test-repo",
	private: false,
	owner: {
		login: "test-owner",
		id: 101,
		avatar_url: "https://avatars.githubusercontent.com/u/101?v=4",
		html_url: "https://github.com/test-owner",
	},
	html_url: "https://github.com/test-owner/test-repo",
	description: "A test repository",
	fork: false,
	url: "https://api.github.com/repos/test-owner/test-repo",
	created_at: "2023-01-01T00:00:00Z",
	updated_at: "2023-01-01T00:00:00Z",
	pushed_at: "2023-01-01T00:00:00Z",
	git_url: "git://github.com/test-owner/test-repo.git",
	ssh_url: "git@github.com:test-owner/test-repo.git",
	clone_url: "https://github.com/test-owner/test-repo.git",
	svn_url: "https://github.com/test-owner/test-repo",
	homepage: null,
	stargazers_count: 0,
	watchers_count: 0,
	language: "TypeScript",
	has_issues: true,
	has_projects: true,
	has_downloads: true,
	has_wiki: true,
	has_pages: false,
	forks_count: 0,
	mirror_url: null,
	archived: false,
	disabled: false,
	open_issues_count: 0,
	license: null,
	allow_forking: true,
	is_template: false,
	topics: [],
	visibility: "public",
	forks: 0,
	open_issues: 0,
	watchers: 0,
	default_branch: "main",
};

const mockIssue = {
	id: 1,
	number: 1347,
	title: "Found a bug",
	node_id: "MDU6SXNzdWUx",
	url: "https://api.github.com/repos/test-owner/test-repo/issues/1347",
	repository_url: "https://api.github.com/repos/test-owner/test-repo",
	labels_url: "https://api.github.com/repos/test-owner/test-repo/issues/1347/labels{/name}",
	comments_url: "https://api.github.com/repos/test-owner/test-repo/issues/1347/comments",
	events_url: "https://api.github.com/repos/test-owner/test-repo/issues/1347/events",
	html_url: "https://github.com/test-owner/test-repo/issues/1347",
	state: "open",
	body: "I'm having a problem with this.",
	user: mockRepo.owner,
	labels: [],
	assignee: null,
	assignees: [],
	milestone: null,
	locked: false,
	active_lock_reason: null,
	comments: 0,
	closed_at: null,
	created_at: "2023-01-01T00:00:00Z",
	updated_at: "2023-01-01T00:00:00Z",
	author_association: "OWNER",
};

describe("@wts/github", () => {
	const svc = makeGitHub({ baseUrl: "https://example.test" });

	afterEach(() => {
		vi.restoreAllMocks();
	});

	test("getRepo should return a valid repo on success", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify(mockRepo), {
				status: 200,
				headers: { "content-type": "application/json" },
			}),
		);
		vi.spyOn(global, "fetch").mockImplementation(fetchMock);

		const result = await Effect.runPromiseEither(svc.getRepo("a", "b"));

		expect(result._tag).toBe("Right");
		if (result._tag !== "Right") throw new Error("Expected Right");
		expect(result.right.id).toBe(mockRepo.id);
		expect(result.right.full_name).toBe(mockRepo.full_name);
	});

	test("getRepo should return GitHubHttpError on fetch error", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ message: "Not Found" }), {
				status: 404,
			}),
		);
		vi.spyOn(global, "fetch").mockImplementation(fetchMock);

		const result = await Effect.runPromiseEither(svc.getRepo("a", "b"));

		expect(result._tag).toBe("Left");
		if (result._tag !== "Left") throw new Error("Expected Left");
		expect(result.left).toBeInstanceOf(GitHubHttpError);
	});

	test("getRepo should return GitHubError on validation error", async () => {
		const invalidRepo = { ...mockRepo, id: "not-a-number" };
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify(invalidRepo), {
				status: 200,
				headers: { "content-type": "application/json" },
			}),
		);
		vi.spyOn(global, "fetch").mockImplementation(fetchMock);

		const result = await Effect.runPromiseEither(svc.getRepo("a", "b"));

		expect(result._tag).toBe("Left");
		if (result._tag !== "Left") throw new Error("Expected Left");
		expect(result.left).toBeInstanceOf(GitHubError);
	});

	test("GitHubLive should wire the service through Effect context", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify(mockRepo), {
				status: 200,
				headers: { "content-type": "application/json" },
			}),
		);
		vi.spyOn(global, "fetch").mockImplementation(fetchMock);

		const program = getRepo("o", "r");
		const result = await Effect.runPromiseEither(Effect.provideLayer(program, GitHubLive));

		expect(result._tag).toBe("Right");
		if (result._tag !== "Right") throw new Error("Expected Right");
		expect(result.right.id).toBe(mockRepo.id);
	});

	test("getUser should return a valid user on success", async () => {
		const mockUser = { login: "test-user", id: 123 };
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify(mockUser), {
				status: 200,
				headers: { "content-type": "application/json" },
			}),
		);
		vi.spyOn(global, "fetch").mockImplementation(fetchMock);

		const result = await Effect.runPromiseEither(svc.getUser("test-user"));

		expect(result._tag).toBe("Right");
		if (result._tag !== "Right") throw new Error("Expected Right");
	});

	test("listUserRepos should call fetch with pagination parameters", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify([mockRepo]), {
				status: 200,
				headers: { "content-type": "application/json" },
			}),
		);
		vi.spyOn(global, "fetch").mockImplementation(fetchMock);

		await Effect.runPromise(svc.listUserRepos("test-owner", { page: 2, per_page: 30 }));

		expect(fetchMock).toHaveBeenCalledWith(
			new URL("https://example.test/users/test-owner/repos?page=2&per_page=30"),
			expect.any(Object),
		);
	});

	test("createIssue should call fetch with POST method and correct body", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify(mockIssue), {
				status: 201,
				headers: { "content-type": "application/json" },
			}),
		);
		vi.spyOn(global, "fetch").mockImplementation(fetchMock);

		const issueData = {
			title: "New Issue",
			body: "This is the issue body.",
			labels: ["bug"],
		};
		const result = await Effect.runPromiseEither(
			svc.createIssue("test-owner", "test-repo", issueData.title, {
				body: issueData.body,
				labels: issueData.labels,
			}),
		);

		expect(result._tag).toBe("Right");
		if (result._tag !== "Right") throw new Error("Expected Right");

		expect(fetchMock).toHaveBeenCalledWith(
			new URL("https://example.test/repos/test-owner/test-repo/issues"),
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({
					title: issueData.title,
					body: issueData.body,
					labels: issueData.labels,
				}),
			}),
		);
	});
});
