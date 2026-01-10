import { DEFAULT_HISTORY_SIZE, DEFAULT_HISTORY_FILE, DEFAULT_THEME, DEFAULT_PROMPT, DEFAULT_CONTINUATION_PROMPT } from "../constant/constants";
import { ShellConfig } from "../types/config";

export const DEFAULT_CONFIG: ShellConfig = ShellConfig.make({
	theme: DEFAULT_THEME,
	promptStyle: DEFAULT_PROMPT,
	continuationPrompt: DEFAULT_CONTINUATION_PROMPT,
	historySize: DEFAULT_HISTORY_SIZE,
	historyFile: DEFAULT_HISTORY_FILE,
	aliases: {
		ll: "ls -la",
		g: "git",
	},
	envVars: {},
	plugins: [],
	hooks: {},
});

export const validateConfig = (config: unknown): ShellConfig => {
	return ShellConfig.make(config as any);
};
