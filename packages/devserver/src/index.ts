// Main exports
export { createApp } from "./app";
export { createDevServer } from "./services/dev-server.service";

// Web server (merged from w-webserver)
export { createWebServerPlugin } from "webserver/vite-plugin-wserver";
export type { WServerOptions } from "webserver/vite-plugin-wserver";

// Type exports
export type { HotReloadService, PerformanceMonitor, PerformanceStats } from "./services";
export type { DevServerConfig, DevServerInstance, ServerStats } from "./types";

// Component exports
export { createErrorMessage, formatErrorMessage } from "./components";
