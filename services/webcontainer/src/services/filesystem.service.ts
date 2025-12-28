import { Effect } from "effect";
import { createFileSystem, createFileSystemConfig } from "file-system";
import { join } from "node:path";
import type { FileInfo } from "../types";

export class FileSystemService {
	private readonly fs = createFileSystem(createFileSystemConfig());
	constructor(private readonly workdir: string) {}

	private readonly fullPath = (path: string) => join(this.workdir, path);

	private readonly run = <A>(effect: Effect.Effect<A, Error>) => Effect.runPromise(effect);

	async readFile(path: string): Promise<string> {
		return await this.run(this.fs.readFile(this.fullPath(path)));
	}

	async writeFile(path: string, content: string): Promise<void> {
		await this.run(this.fs.writeFile(this.fullPath(path), content));
	}

	async deleteFile(path: string): Promise<void> {
		await this.run(this.fs.remove(this.fullPath(path)));
	}

	async copyFile(path: string, destination: string): Promise<void> {
		await this.run(this.fs.copy(this.fullPath(path), this.fullPath(destination)));
	}

	async moveFile(path: string, destination: string): Promise<void> {
		await this.run(this.fs.move(this.fullPath(path), this.fullPath(destination)));
	}

	async exists(path: string): Promise<boolean> {
		return await this.run(this.fs.exists(this.fullPath(path)));
	}

	async listFiles(path: string = "."): Promise<FileInfo[]> {
		const absPath = this.fullPath(path);
		const entries = await this.run(this.fs.readDir(absPath));
		return await Promise.all(
			entries.map(async (entry) => {
				const stats = await this.run(this.fs.stat(entry.path));
				return {
					isDirectory: entry.isDirectory,
					modifiedAt: stats.modifiedAt.getTime(),
					name: entry.name,
					path: entry.path.slice(this.workdir.length + 1),
					size: stats.size,
				};
			}),
		);
	}

	async createDirectory(path: string): Promise<void> {
		await this.run(this.fs.mkdir(this.fullPath(path), true));
	}

	async deleteDirectory(path: string): Promise<void> {
		await this.run(this.fs.remove(this.fullPath(path)));
	}

	async watchFile(
		path: string,
		callback: (event: "change" | "rename" | "delete", filename: string | null) => void,
	): Promise<void> {
		const close = await this.run(
			this.fs.watch(this.fullPath(path), (event) => {
				callback(event.type, event.path.split("/").pop() ?? null);
			}),
		);
		close();
	}
}

export const createFileSystemService = (workdir: string): FileSystemService => new FileSystemService(workdir);
