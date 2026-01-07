export const createRoutesDts = (): string => {
	return [
		"declare module \"virtual:vitext/routes\" {",
		"\timport type { WRouteRecord } from \"@wpackages/wrouter\";",
		"\texport const routes: readonly WRouteRecord[];",
		"\tconst _default: readonly WRouteRecord[];",
		"\texport default _default;",
		"}",
		"",
	].join("\n");
};
