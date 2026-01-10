// Explicitly export the function causing issues
export { createConfigManager } from "./services/config-manager.service";

// Re-export other necessary modules
export * from "./app";
export * from "./types";
