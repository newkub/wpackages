export const BUILTIN_COMMANDS = [
	"ls",
	"cd",
	"pwd",
	"echo",
	"cat",
	"help",
	"history",
	"alias",
	"env",
	"clear",
	"exit",
] as const;

export const DEFAULT_HISTORY_SIZE = 1000;
export const DEFAULT_HISTORY_FILE = "~/.wshell_history";
export const DEFAULT_THEME = "default";
export const DEFAULT_PROMPT = ">";
export const DEFAULT_CONTINUATION_PROMPT = "...>";

export const SHELL_NAME = "wshell";
export const SHELL_VERSION = "0.0.1";

export const TOKEN_TYPES = {
	COMMAND: "command",
	STRING: "string",
	VARIABLE: "variable",
	PIPE: "pipe",
	REDIRECT_IN: "redirect_in",
	REDIRECT_OUT: "redirect_out",
	REDIRECT_APPEND: "redirect_append",
	AND: "and",
	OR: "or",
	SEMICOLON: "semicolon",
} as const;

export const COMPLETION_TYPES = {
	COMMAND: "command",
	FILE: "file",
	ENV: "env",
	ARGUMENT: "argument",
} as const;

export const HOOK_TYPES = {
	BEFORE: "before",
	AFTER: "after",
	ERROR: "error",
} as const;
