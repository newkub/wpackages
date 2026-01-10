export function command<T>(
	execute: () => T,
	undo?: () => void,
): {
	execute: () => T;
	undo: () => void;
} {
	return {
		execute,
		undo: undo || (() => {}),
	};
}
