import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vitest-tsconfig-paths";

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		globals: true,
		environment: "node",
		deps: {
			hints: false,
		},
	},
	resolve: {
		alias: {
			"./jsx-dev-runtime": "react/jsx-dev-runtime",
			"./jsx-runtime": "react/jsx-runtime",
		},
	},
});
