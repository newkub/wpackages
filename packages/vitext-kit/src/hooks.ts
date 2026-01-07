export type VitextHookHandler = (...args: readonly unknown[]) => void | Promise<void>;

export type VitextHookMap = Record<string, VitextHookHandler>;

export type VitextHooks<T extends VitextHookMap> = {
	on: <K extends keyof T>(name: K, handler: T[K]) => void;
	emit: <K extends keyof T>(name: K, ...args: Parameters<T[K]>) => Promise<void>;
};

export const createHooks = <T extends VitextHookMap>(): VitextHooks<T> => {
	const listeners = new Map<keyof T, Array<T[keyof T]>>();

	return {
		on: (name, handler) => {
			const existing = listeners.get(name) ?? [];
			existing.push(handler as T[keyof T]);
			listeners.set(name, existing);
		},
		emit: async (name, ...args) => {
			const existing = listeners.get(name);
			if (!existing) {
				return;
			}
			for (const handler of existing) {
				await (handler as (...a: readonly unknown[]) => void | Promise<void>)(...args);
			}
		},
	};
};
