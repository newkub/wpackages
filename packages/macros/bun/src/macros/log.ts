export const log = Bun.macro((...args: readonly unknown[]) => {
	const line = import.meta.line ?? 0;
	const path = import.meta.path ?? "";
	return `console.log("[${path}:${line}]", ...${JSON.stringify(args)})`;
});
