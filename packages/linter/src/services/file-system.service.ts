import { Effect } from "effect";
import type { Dirent } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { FileSystemError } from "../types";

export const makeFileSystemService = () => ({
	readdir: (path: string): Effect.Effect<Dirent[], FileSystemError> =>
		Effect.tryPromise({
			try: () => readdir(path, { withFileTypes: true }),
			catch: (cause) => new FileSystemError({ message: `Failed to read directory`, path, cause }),
		}),
	readFile: (path: string): Effect.Effect<string, FileSystemError> =>
		Effect.tryPromise({
			try: () => readFile(path, "utf-8"),
			catch: (cause) => new FileSystemError({ message: `Failed to read file`, path, cause }),
		}),
});

export const FileSystemService = makeFileSystemService();
