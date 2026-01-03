import { createHistory } from "./history";
import { createHashSource } from "./sources/hash";
import { History } from "./types";

export function createHashHistory(): History {
	return createHistory(createHashSource());
}
