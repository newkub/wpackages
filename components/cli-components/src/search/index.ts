import { emitKeypressEvents } from "node:readline";
import { createInitialState } from "./state";
import { render } from "./renderer";
import { handleKeyPress } from "./key-handler";
import type { SearchOptions } from "./types";

export async function interactiveSearch<T>(
    options: SearchOptions<T>,
): Promise<T> {
    const maxItems = options.maxItems || 10;
    const state = createInitialState(options.options, maxItems);

    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }
    emitKeypressEvents(process.stdin);

    return new Promise((resolve) => {
        const cleanup = () => {
            if (process.stdin.isTTY) {
                process.stdin.setRawMode(false);
            }
            process.stdin.removeAllListeners("keypress");
        };

        render(state, options);
        state.isFirstRender = false;

        process.stdin.on("keypress", (str, key) => {
            handleKeyPress(str, key, state, options, resolve, cleanup);
        });
    });
}
