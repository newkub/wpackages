import type { Effect } from "effect";

// File stats
export type FileStats = {
	readonly size: number;
	readonly createdAt: Date;
	readonly modifiedAt: Date;
	readonly isFile: boolean;
	readonly isDirectory: boolean;
	readonly permissions: number;
};

// Directory entry
export type DirectoryEntry = {
	readonly name: string;
	readonly path: string;
	readonly isFile: boolean;
	readonly isDirectory: boolean;
	readonly size?: number;
};

// File encoding
export type FileEncoding = "utf8" | "utf-8" | "ascii" | "base64" | "binary";

// File system operations
export type FileSystem = {
	// Read operations
	readonly readFile: (
		path: string,
		encoding?: FileEncoding,
	) => Effect.Effect<string, Error>;
	readonly readFileBuffer: (path: string) => Effect.Effect<Buffer, Error>;
	readonly readDir: (
		path: string,
	) => Effect.Effect<readonly DirectoryEntry[], Error>;
	readonly exists: (path: string) => Effect.Effect<boolean, Error>;
	readonly stat: (path: string) => Effect.Effect<FileStats, Error>;

	// Write operations
	readonly writeFile: (
		path: string,
		content: string,
		encoding?: FileEncoding,
	) => Effect.Effect<void, Error>;
	readonly appendFile: (
		path: string,
		content: string,
	) => Effect.Effect<void, Error>;
	readonly mkdir: (
		path: string,
		recursive?: boolean,
	) => Effect.Effect<void, Error>;
	readonly remove: (path: string) => Effect.Effect<void, Error>;
	readonly copy: (src: string, dest: string) => Effect.Effect<void, Error>;
	readonly move: (src: string, dest: string) => Effect.Effect<void, Error>;

	// Watch operations
	readonly watch: (
		path: string,
		callback: (event: FileSystemEvent) => void,
	) => Effect.Effect<() => void, Error>;
};

// File system event
export type FileSystemEvent = {
	readonly type: "change" | "rename" | "delete";
	readonly path: string;
	readonly timestamp: number;
};

// Path info
export type PathInfo = {
	readonly dirname: string;
	readonly basename: string;
	readonly extname: string;
	readonly filename: string;
};
