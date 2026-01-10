import type { ShellConfig } from "./src/types/config";

export const config: ShellConfig = {
	theme: "default",
	promptStyle: ">",
	continuationPrompt: "...>",
	historySize: 1000,
	historyFile: "~/.wshell_history",
	aliases: {
		ll: "ls -la",
		g: "git",
	},
	envVars: {},
	plugins: [],
	hooks: {},
};
