import { parseWithOXC } from "@wpackages/parser";
import type { WRouteRecord } from "./generator";

export type VirtualRoutesModule = {
	readonly routes: readonly WRouteRecord[];
};

export const generateVirtualRoutesModuleCode = (routes: readonly WRouteRecord[]): string => {
	void parseWithOXC("export const __check = 1;", {});
	const body = JSON.stringify(routes);
	return `export const routes = ${body};\nexport default routes;\n`;
};
