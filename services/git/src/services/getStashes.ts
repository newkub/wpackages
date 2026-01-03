import { Effect } from "effect";
import { GitCommandError, GitParseError } from "../errors";
import type { GitStash } from "../types/git";
import { parseGitStashes } from "../utils/parse.utils";
import { runGitCommand } from "./runGitCommand";

export const getStashes = (
	path: string,
): Effect.Effect<readonly GitStash[], GitCommandError | GitParseError> =>
	runGitCommand(path, "stash list").pipe(
		Effect.flatMap((output) =>
			Effect.try({
				try: () => parseGitStashes(output),
				catch: (cause) => new GitParseError({ cause, input: output }),
			})
		),
	);
