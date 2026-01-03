import { Option } from "effect";
import type { GitBranch, GitCommit, GitStash, GitRemote, GitStatus } from "../types/objects";
import type { GitReflogEntry, GitDiff, GitBlameLine } from "../types/operations";

// Parse git URL
export const parseGitUrl = (
	url: string,
): { host: string; owner: string; repo: string } | null => {
	// SSH format: git@github.com:owner/repo.git
	const sshMatch = url.match(/git@(.+?):(.+?)\/(.+?)(?:\.git)?$/);
	if (sshMatch) {
		return {
			host: sshMatch[1] ?? "",
			owner: sshMatch[2] ?? "",
			repo: sshMatch[3] ?? "",
		};
	}

	// HTTPS format: https://github.com/owner/repo.git
	const httpsMatch = url.match(/https?:\/\/(.+?)\/(.+?)\/(.+?)(?:\.git)?$/);
	if (httpsMatch) {
		return {
			host: httpsMatch[1] ?? "",
			owner: httpsMatch[2] ?? "",
			repo: httpsMatch[3] ?? "",
		};
	}

	return null;
};

// Format commit hash (short)
export const formatCommitHash = (hash: string, length = 7): string => {
	return hash.substring(0, length);
};

// Parse branch name from ref
export const parseBranchName = (ref: string): string => {
	return ref.replace(/^refs\/heads\//, "");
};

// Parse status line
export const parseStatusLine = (
	line: string,
): { status: string; file: string } | null => {
	if (!line || line.length < 3) return null;
	return {
		file: line.substring(3),
		status: line.substring(0, 2),
	};
};

// Parse commit line from log
export const parseCommitLine = (
	line: string,
): GitCommit | null => {
	const parts = line.split("|");
	if (parts.length < 6) return null;

	const base = {
		author: parts[2] ?? "",
		date: new Date(parts[4] ?? ""),
		email: parts[3] ?? "",
		hash: parts[0] ?? "",
		message: parts[5] ?? "",
		shortHash: parts[1] ?? "",
	};

	return parts[6] ? { ...base, body: parts[6] } : base;
};

// Parse branch line
export const parseBranchLine = (
	line: string,
): GitBranch | null => {
	if (!line) return null;
	const isCurrent = line.startsWith("*");
	const cleanLine = line.substring(isCurrent ? 1 : 0);
	const [name, remote] = cleanLine.split("|");
	if (!name) return null;

	return { 
		name, 
		current: isCurrent, 
		...(remote && remote !== '' ? { remote } : {}), 
	};
};

// Parse remote line
export const parseRemoteLine = (
	line: string,
): {
	name: string;
	url: string;
	type: "fetch" | "push";
} | null => {
	const parts = line.split(/\s+/);
	if (parts.length < 3) return null;

	return {
		name: parts[0] ?? "",
		type: parts[2]?.includes("fetch") ? "fetch" : "push",
		url: parts[1] ?? "",
	};
};

// Parse stash line
export const parseStashLine = (
	line: string,
	index: number,
): GitStash | null => {
	if (!line) return null;
	const match = line.match(/stash@\{(\d+)\}: (WIP on|On) (.+?): (.+)/);
	if (!match) return { branch: "", date: new Date(), index, message: line };

	return {
		branch: match[3] ?? "",
		date: new Date(),
		index,
		message: match[4] ?? line,
	};
};

// Parse reflog line
export const parseReflogLine = (
	line: string,
): GitReflogEntry | null => {
	const parts = line.split("|");
	if (parts.length < 4) return null;

	return {
		action: parts[3] ?? "",
		date: new Date(),
		hash: parts[0] ?? "",
		message: parts[2] ?? "",
		shortHash: parts[1] ?? "",
	};
};

// Split and filter lines
export const splitLines = (text: string): readonly string[] => {
	return text.split("\n").filter((line) => line.trim() !== "");
};

// Compact array (remove empty strings)
export const compact = <T>(arr: readonly T[]): readonly T[] => {
	return arr.filter((item) => item !== "" && item != null);
};

// Parse multiple remote lines
export const parseGitRemotes = (
	output: string,
): readonly GitRemote[] => {
	return splitLines(output)
		.map(parseRemoteLine)
		.filter((remote): remote is GitRemote => remote !== null);
};

// Parse git diff --numstat output
export const parseGitDiff = (output: string): readonly GitDiff[] => {
    return splitLines(output).map(line => {
        const [additions, deletions, file] = line.split('\t');
        return {
            file: file ?? '',
            additions: parseInt(additions ?? '0', 10),
            deletions: parseInt(deletions ?? '0', 10),
            changes: [], // --numstat doesn't provide line-by-line changes
        };
    });
};

// Parse git blame output
export const parseGitBlame = (output: string): readonly GitBlameLine[] => {
    const lines: GitBlameLine[] = [];
    const lineRegex = /^([a-f0-9^]+)\s+.*?\((.+?)\s+(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\s[+-]\d{4})\s+(\d+)\)(.*)$/;
    
    splitLines(output).forEach((line) => {
        const match = line.match(lineRegex);
        if (match) {
            const [, hash, author, dateStr, lineNum, content] = match;
            lines.push({
                line: parseInt(lineNum ?? '0', 10),
                hash: hash ?? '',
                author: author?.trim() ?? '',
                date: new Date(dateStr ?? ''),
                content: content ?? ''
            });
        }
    });
    return lines;
};

// Parse multiple stash lines
export const parseGitStashes = (
	output: string,
): readonly GitStash[] => {
	return splitLines(output)
		.map((line, index) => parseStashLine(line, index))
		.filter((stash): stash is GitStash => stash !== null);
};

// Parse a single commit line (alias for parseCommitLine)
export const parseSingleCommit = parseCommitLine;

// Parse multiple reflog lines
export const parseGitReflog = (
	output: string,
): readonly GitReflogEntry[] => {
	return splitLines(output)
		.map(parseReflogLine)
		.filter((entry): entry is NonNullable<typeof entry> => entry !== null);
};

// Parse multiple branch lines
export const parseGitBranches = (
	output: string,
): readonly GitBranch[] => {
	return splitLines(output)
		.map(parseBranchLine)
		.filter((branch): branch is NonNullable<typeof branch> => branch !== null);
};

// Parse git log output
export const parseGitStatus = (output: string): GitStatus => {
    const lines = splitLines(output);
    const branchLine = lines.shift();
    if (!branchLine) {
        throw new Error("Could not determine branch from git status.");
    }

    const branchMatch = branchLine.match(/^## (\S+?)(?:\.\.\.(\S+))?(?: \[ahead (\d+)\])?(?: \[behind (\d+)\])?$/);
    const branch = branchMatch?.[1] || '';
    const ahead = Option.fromNullable(branchMatch?.[3]).pipe(Option.map(s => parseInt(s, 10)), Option.getOrElse(() => 0));
    const behind = Option.fromNullable(branchMatch?.[4]).pipe(Option.map(s => parseInt(s, 10)), Option.getOrElse(() => 0));

    const staged: string[] = [];
    const modified: string[] = [];
    const untracked: string[] = [];
    const deleted: string[] = [];

    for (const line of lines) {
        const status = line.substring(0, 2);
        const file = line.substring(3);

        if (status.startsWith('??')) {
            untracked.push(file);
        } else {
            const indexStatus = status[0];
            const workTreeStatus = status[1];

            if (indexStatus !== ' ') staged.push(file);
            if (workTreeStatus === 'M') modified.push(file);
            if (workTreeStatus === 'D' || indexStatus === 'D') deleted.push(file);
        }
    }

    return { branch, ahead, behind, staged, modified, untracked, deleted };
};

export const parseGitLog = (output: string): readonly GitCommit[] => {
    return splitLines(output)
        .map((line: string) => {
            const parts: string[] = [];
            let remaining = line;
            for (let i = 0; i < 5; i++) {
                const index = remaining.indexOf('|');
                if (index === -1) return null;
                parts.push(remaining.substring(0, index));
                remaining = remaining.substring(index + 1);
            }
            parts.push(remaining);

            const [hash, shortHash, author, email, dateStr, message] = parts;

            if (!hash || !shortHash || !author || !email || !dateStr || !message || !/^\d+$/.test(dateStr)) {
                return null;
            }

            return {
                hash,
                shortHash,
                author,
                email,
                date: new Date(parseInt(dateStr, 10) * 1000),
                message,
            };
        })
        .filter((commit): commit is GitCommit => commit !== null);
};
