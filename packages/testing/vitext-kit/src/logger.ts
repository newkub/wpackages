import { ConsoleService } from "@wpackages/tui";

export type VitextLogger = {
	info: (message: string) => Promise<void>;
	success: (message: string) => Promise<void>;
	warn: (message: string) => Promise<void>;
	error: (message: string) => Promise<void>;
};

export const createVitextLogger = (prefix: string): VitextLogger => {
	const format = (message: string) => `[vitext:${prefix}] ${message}`;

	return {
		info: async (message) => ConsoleService.info(format(message)),
		success: async (message) => ConsoleService.success(format(message)),
		warn: async (message) => ConsoleService.warn(format(message)),
		error: async (message) => ConsoleService.error(format(message)),
	};
};
