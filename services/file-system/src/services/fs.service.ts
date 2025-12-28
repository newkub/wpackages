import { Effect } from "effect";
import { promises as fs, watch as fsWatch } from "node:fs";
import type { FileSystemConfig } from "../fs.config";
import type { FileSystem } from "../types/fs";

// Create file system service
export const createFileSystem = (config: FileSystemConfig): FileSystem => {
	const tryPromise = <T>(fn: () => Promise<T>, errorMessage: string) =>
		Effect.tryPromise({
			try: fn,
			catch: (error: unknown) => new Error(`${errorMessage}: ${String(error)}`),
		});

	return {
		appendFile: (path, content) =>
			tryPromise(
				() => fs.appendFile(path, content, config.encoding).then(() => undefined),
				`Failed to append file ${path}`,
			),

		copy: (src, dest) =>
			tryPromise(
				() => fs.copyFile(src, dest).then(() => undefined),
				`Failed to copy ${src} to ${dest}`,
			),

		exists: (path) =>
			tryPromise(
				() => fs.access(path).then(() => true).catch(() => false),
				`Failed to check existence ${path}`,
			),

		mkdir: (path, recursive = true) =>
			tryPromise(
				() => fs.mkdir(path, { recursive }).then(() => undefined),
				`Failed to create directory ${path}`,
			),

		move: (src, dest) =>
			tryPromise(
				() => fs.rename(src, dest).then(() => undefined),
				`Failed to move ${src} to ${dest}`,
			),

		readDir: (path) =>
			tryPromise(
				async () => {
					const entries = await fs.readdir(path, { withFileTypes: true });
					return entries.map((entry) => ({
						isDirectory: entry.isDirectory(),
						isFile: entry.isFile(),
						name: entry.name,
						path: `${path}/${entry.name}`,
					}));
				},
				`Failed to read directory ${path}`,
			),

		readFile: (path, encoding = config.encoding) =>
			tryPromise(
				() => fs.readFile(path, encoding),
				`Failed to read file ${path}`,
			),

		readFileBuffer: (path) =>
			tryPromise(
				() => fs.readFile(path),
				`Failed to read file buffer ${path}`,
			),

		remove: (path) =>
			tryPromise(
				() => fs.rm(path, { force: true, recursive: true }).then(() => undefined),
				`Failed to remove ${path}`,
			),

		stat: (path) =>
			tryPromise(
				async () => {
					const stats = await fs.stat(path);
					return {
						createdAt: stats.birthtime,
						isDirectory: stats.isDirectory(),
						isFile: stats.isFile(),
						modifiedAt: stats.mtime,
						permissions: stats.mode,
						size: stats.size,
					};
				},
				`Failed to stat ${path}`,
			),

		watch: (path, callback) =>
			tryPromise(
				() => {
					const watcher = fsWatch(path, (eventType, filename) => {
						callback({
							path: filename ? `${path}/${filename}` : path,
							timestamp: Date.now(),
							type: eventType === "rename" ? "rename" : "change",
						});
					});
					return Promise.resolve(() => watcher.close());
				},
				`Failed to watch ${path}`,
			),

		writeFile: (path, content, encoding = config.encoding) =>
			tryPromise(
				() => fs.writeFile(path, content, encoding).then(() => undefined),
				`Failed to write file ${path}`,
			),
	};
};
