import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		name: "github",
		environment: "node",
		include: ["src/**/*.test.ts"],
		deps: {
			inline: ["@wpackages/functional", "zod"],
		},
	},
});
