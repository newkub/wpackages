import { createVitextApp } from "./app";
import { defineConfig } from "./config/vitext";
import { DevServer } from "./services/dev-server";

export type { DevServerInstance } from "devserver";
export type { BuildConfig, VitextConfig } from "./types/config";
export type { VitextServer } from "./types/server";
export type { VitextAppInstance } from "./app";

export { createVitextApp, defineConfig, DevServer };
