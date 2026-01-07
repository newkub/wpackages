import { createVitextLogger } from "@wpackages/vitext-kit";
import { generateRoutes, generateVirtualRoutesModuleCode, type WRouteRecord } from "@wpackages/wrouter";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { Plugin, ResolvedConfig } from "vite";
import { createRoutesDts } from "./dts";
import { RESOLVED_VIRTUAL_ROUTES_ID, VIRTUAL_ROUTES_ID } from "./virtual";

export type VitextViteOptions = {
	readonly pagesDir?: string;
	readonly dts?: boolean;
	readonly dtsFile?: string;
};

const resolvePagesDir = (config: ResolvedConfig, pagesDir?: string): string => {
	return resolve(config.root, pagesDir ?? "pages");
};

export const vitext = (options: VitextViteOptions = {}): Plugin => {
	const logger = createVitextLogger("vite");
	let config: ResolvedConfig;
	let routes: readonly WRouteRecord[] = [];
	let pagesDir = "";

	const dtsEnabled = options.dts ?? true;
	const dtsFile = options.dtsFile ?? ".vitext/vitext.d.ts";

	const writeDts = async () => {
		if (!dtsEnabled) {
			return;
		}
		const fullPath = resolve(config.root, dtsFile);
		await mkdir(dirname(fullPath), { recursive: true });
		await writeFile(fullPath, createRoutesDts(), "utf-8");
		await logger.success(`generated d.ts: ${dtsFile}`);
	};

	const refreshRoutes = async () => {
		routes = generateRoutes({ pagesDir });
		await logger.info(`routes: ${routes.length}`);
	};

	return {
		name: "vitext:vite",
		enforce: "pre",
		configResolved: async (resolved) => {
			config = resolved;
			pagesDir = resolvePagesDir(resolved, options.pagesDir);
			await refreshRoutes();
			await writeDts();
		},
		resolveId: (id) => {
			if (id === VIRTUAL_ROUTES_ID) {
				return RESOLVED_VIRTUAL_ROUTES_ID;
			}
			return null;
		},
		load: (id) => {
			if (id === RESOLVED_VIRTUAL_ROUTES_ID) {
				return generateVirtualRoutesModuleCode(routes);
			}
			return null;
		},
		handleHotUpdate: async (ctx) => {
			if (ctx.file.startsWith(pagesDir)) {
				await refreshRoutes();
				ctx.server.ws.send({
					type: "full-reload",
					path: "*",
				});
			}
		},
	};
};

export default vitext;
