import type { Accessor } from "./ref.type";

// React Integration Types
export interface ReactHookOptions<T> {
	equalityFn?: (prev: T, next: T) => boolean;
}

export interface UseSignalReturn<T> {
	value: T;
	setValue: (value: T | ((prev: T) => T)) => void;
}

export interface UseComputedReturn<T> {
	value: T;
}

export interface UseResourceReturn<_T> {
	data: _T | undefined;
	loading: boolean;
	error: unknown;
	refetch: () => Promise<_T | undefined>;
}

// Vue Integration Types
export interface VueComposableOptions<_T = unknown> {
	deep?: boolean;
	immediate?: boolean;
}

export interface UseSignalVueReturn<T> {
	value: T;
}

export interface UseComputedVueReturn<T> {
	value: T;
}

export interface UseResourceVueReturn<T> {
	data: Accessor<T | undefined>;
	loading: Accessor<boolean>;
	error: Accessor<unknown>;
	refetch: () => Promise<T | undefined>;
}

// Svelte Integration Types
export interface SvelteStoreOptions<T> {
	start?: (set: (value: T) => void) => () => void;
}

export interface SignalStore<T> {
	subscribe: (run: (value: T) => void, invalidate?: (value?: T) => void) => Unsubscriber;
	set: (value: T) => void;
	update: (updater: (value: T) => T) => void;
}

export type Unsubscriber = () => void;

// SolidJS Compatibility Types
export interface SolidSignal<T> {
	(): T;
	(value: T): T;
}

export interface SolidMemo<T> {
	(): T;
}

export interface SolidResource<T> {
	(): T | undefined;
	loading: boolean;
	error: unknown;
	refetch: () => Promise<T | undefined>;
}

// SSR/Hydration Types
export interface SerializedSignal {
	id: string;
	value: unknown;
	version: number;
}

export interface SerializedState {
	signals: SerializedSignal[];
	version: string;
	timestamp: number;
}

export interface HydrationOptions {
	revive?: (value: unknown) => unknown;
	validate?: (state: SerializedState) => boolean;
}

export interface SSRContext {
	isServer: boolean;
	serialize: () => SerializedState;
	registerSignal: (id: string, getter: () => unknown) => void;
}

export interface SuspenseOptions {
	fallback?: any;
	timeout?: number;
}

export interface SuspenseResult {
	data: unknown;
	loading: boolean;
	error: unknown;
}

// Common Types
export type FrameworkType = "react" | "vue" | "svelte" | "solid" | "vanilla";

export interface FrameworkAdapter {
	type: FrameworkType;
	createSignal: <T>(initial: T) => T;
	createMemo: <T>(fn: () => T) => T;
	createEffect: (fn: () => void) => () => void;
}
