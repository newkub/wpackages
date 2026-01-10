import { Effect } from "effect";
import type { Location } from "../types";

export type HistoryState = {
	readonly index: number;
	readonly entries: readonly Location[];
};

export class HistoryManager {
	protected entries: Location[] = [];
	protected index = -1;
	private listeners = new Set<(location: Location) => void>();

	constructor(initialLocation: Location) {
		this.entries.push(initialLocation);
		this.index = 0;
	}

	get location(): Location {
		return this.entries[this.index] ?? this.entries[0]!;
	}

	get length(): number {
		return this.entries.length;
	}

	listen(listener: (location: Location) => void): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	push(location: Location): Effect.Effect<void, never> {
		return Effect.sync(() => {
			this.entries = [...this.entries.slice(0, this.index + 1), location];
			this.index = this.entries.length - 1;
			this.notify(location);
		});
	}

	replace(location: Location): Effect.Effect<void, never> {
		return Effect.sync(() => {
			this.entries = [...this.entries.slice(0, this.index), location];
			this.notify(location);
		});
	}

	go(delta: number): Effect.Effect<void, never> {
		return Effect.sync(() => {
			const newIndex = this.index + delta;
			if (newIndex >= 0 && newIndex < this.entries.length) {
				this.index = newIndex;
				this.notify(this.entries[newIndex]!);
			}
		});
	}

	back(): Effect.Effect<void, never> {
		return this.go(-1);
	}

	forward(): Effect.Effect<void, never> {
		return this.go(1);
	}

	protected notify(location: Location): void {
		this.listeners.forEach((listener) => listener(location));
	private notify(location: Location): void {
		for (const listener of this.listeners) {
			listener(location);
		}
	}
}

export class BrowserHistory extends HistoryManager {
	constructor() {
		super({
			pathname: window.location.pathname,
			search: window.location.search,
			hash: window.location.hash,
			state: history.state,
		});

		window.addEventListener("popstate", this.handlePopState);
	}

	private readonly handlePopState = (event: PopStateEvent): void => {
		const location: Location = {
			pathname: window.location.pathname,
			search: window.location.search,
			hash: window.location.hash,
			state: event.state,
		};
		this.replace(location);
	};

	push(path: string, state?: unknown): Effect.Effect<void, never> {
		const url = new URL(path, window.location.origin);
		const location: Location = {
			pathname: url.pathname,
			search: url.search,
			hash: url.hash,
			state,
		};

		return Effect.sync(() => {
			window.history.pushState(state, "", path);
			this.entries = [...this.entries.slice(0, this.index + 1), location];
			this.index = this.entries.length - 1;
			this.notify(location);
		});
	}

	replace(path: string, state?: unknown): Effect.Effect<void, never> {
		const url = new URL(path, window.location.origin);
		const location: Location = {
			pathname: url.pathname,
			search: url.search,
			hash: url.hash,
			state,
		};

		return Effect.sync(() => {
			window.history.replaceState(state, "", path);
			this.entries = [...this.entries.slice(0, this.index), location];
			this.notify(location);
		});
	}

	go(delta: number): Effect.Effect<void, never> {
		return Effect.sync(() => {
			window.history.go(delta);
		});
	}

	destroy(): void {
		window.removeEventListener("popstate", this.handlePopState);
	}
}

export class MemoryHistory extends HistoryManager {
	constructor(initialEntries: readonly string[] = ["/"]) {
		const initialLocation: Location = {
			pathname: initialEntries[0] ?? "/",
			search: "",
			hash: "",
			state: null,
		};
		super(initialLocation);
	}

	push(path: string, state?: unknown): Effect.Effect<void, never> {
		const location: Location = {
			pathname: path.split("?")[0]?.split("#")[0] ?? "/",
			search: path.includes("?") ? `?${path.split("?")[1]?.split("#")[0] ?? ""}` : "",
			hash: path.includes("#") ? `#${path.split("#")[1] ?? ""}` : "",
			state,
		};

		return HistoryManager.prototype.push.call(this, location);
	}

	replace(path: string, state?: unknown): Effect.Effect<void, never> {
		const location: Location = {
			pathname: path.split("?")[0]?.split("#")[0] ?? "/",
			search: path.includes("?") ? `?${path.split("?")[1]?.split("#")[0] ?? ""}` : "",
			hash: path.includes("#") ? `#${path.split("#")[1] ?? ""}` : "",
			state,
		};

		return HistoryManager.prototype.replace.call(this, location);
	}
}
