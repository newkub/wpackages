import { createHistory } from "./history";
import { createBrowserSource } from "./sources/browser";
import { History } from "./types";

export function createBrowserHistory(): History {
	return createHistory(createBrowserSource());
}
