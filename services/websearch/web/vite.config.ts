import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(() => {
	return {
		plugins: [vue()],
		server: {
			proxy: {
				"/api": {
					target: process.env.VITE_DEV_PROXY_TARGET ?? "http://localhost:3000",
					changeOrigin: true,
				},
			},
		},
	};
});
