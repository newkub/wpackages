import { createHistory } from "./history";
import { createMemorySource } from "./sources/memory";
import { History } from "./types";

export function createMemoryHistory(initialEntries: string[] = ["/"]): History {
	return createHistory(createMemorySource(initialEntries));
}
