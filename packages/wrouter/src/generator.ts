import { extname, relative } from "node:path";
import { toPosixPath } from "./path";
import { normalizeRoutePath, routeNameFromPath } from "./route-utils";
import { walkFiles } from "./walk";

export type WRouteRecord = {
	readonly path: string;
	readonly file: string;
	readonly name: string;
};

export type GenerateRoutesOptions = {
	readonly pagesDir: string;
	readonly extensions?: readonly string[];
	readonly base?: string;
};

const defaultExtensions = Object.freeze([".vue", ".tsx", ".jsx", ".ts", ".js"] as const);

export const generateRoutes = (options: GenerateRoutesOptions): readonly WRouteRecord[] => {
	const extensions = options.extensions ?? defaultExtensions;
	const files = walkFiles(options.pagesDir).filter((f) => extensions.includes(extname(f)));

	const routes = files
		.map((file) => {
			const rel = toPosixPath(relative(options.pagesDir, file));
			const withoutExt = rel.replace(new RegExp(`${extname(rel)}$`), "");
			const base = options.base ?? "";
			const routePath = normalizeRoutePath(`${base}${withoutExt}`.replaceAll("//", "/").replace(/^\//, ""));
			const name = routeNameFromPath(withoutExt);
			return Object.freeze({ path: routePath, file, name });
		})
		.sort((a, b) => a.path.localeCompare(b.path));

	return routes;
};
