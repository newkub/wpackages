import type { SSRContext, SerializedState, HydrationOptions } from "../types";
import { serializeState } from "./serialization.service";
import { hydrateState } from "./hydration.service";

let currentSSRContext: SSRContext | null = null;

export function createSSRContext(options?: { isServer?: boolean }): SSRContext {
	const isServer = options?.isServer ?? typeof window === "undefined";

	const context: SSRContext = {
		isServer,
		serialize: () => {
			if (!isServer) {
				throw new Error("Cannot serialize on client side");
			}
			return serializeState();
		},
		registerSignal: (id: string, getter: () => unknown) => {
			if (isServer) {
				const { registerSignal } = require("./serialization.service");
				registerSignal(id, getter);
			}
		},
	};

	return context;
}

export function getSSRContext(): SSRContext | null {
	return currentSSRContext;
}

export function setSSRContext(context: SSRContext | null): void {
	currentSSRContext = context;
}

export function withSSRContext<T>(
	context: SSRContext,
	fn: () => T,
): T {
	const prevContext = currentSSRContext;
	currentSSRContext = context;

	try {
		return fn();
	} finally {
		currentSSRContext = prevContext;
	}
}

export function isServerSide(): boolean {
	return currentSSRContext?.isServer ?? typeof window === "undefined";
}

export function isClientSide(): boolean {
	return !isServerSide();
}

export function serializeForSSR(_options?: HydrationOptions): SerializedState {
	if (!currentSSRContext) {
		throw new Error("No SSR context available");
	}

	return currentSSRContext.serialize();
}

export function hydrateOnClient(
	serialized: string | SerializedState,
	_options?: HydrationOptions,
): void {
	if (isServerSide()) {
		throw new Error("Cannot hydrate on server side");
	}

	hydrateState(serialized, _options);
}

export function getSSRScriptTag(state: SerializedState): string {
	const serialized = JSON.stringify(state);
	return `<script>window.__SIGNAL_STATE__ = ${serialized};</script>`;
}

export function getHydrationScript(): string {
	return `
<script>
  (function() {
    const state = window.__SIGNAL_STATE__;
    if (state) {
      // Hydrate signals here
      console.log('Hydrating signals...', state);
    }
  })();
</script>
`;
}
