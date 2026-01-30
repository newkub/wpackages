import { createHooks, createVitextLogger } from "../src";

type Hooks = {
	ready: () => void | Promise<void>;
};

const hooks = createHooks<Hooks>();
const logger = createVitextLogger("kit");

hooks.on("ready", async () => {
	await logger.success("ready");
});

await hooks.emit("ready");
