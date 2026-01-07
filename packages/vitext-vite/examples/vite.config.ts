import { defineConfig } from "vite";
import vitext from "../src";

export default defineConfig({
	plugins: [
		vitext({
			pagesDir: "./pages",
		}),
	],
});
