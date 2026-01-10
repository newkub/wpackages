import { describe, it, expect, beforeEach } from "vitest";
import {
	createSSRContext,
	getSSRContext,
	setSSRContext,
	withSSRContext,
	isServerSide,
	isClientSide,
	serializeForSSR,
	hydrateOnClient,
	getSSRScriptTag,
	getHydrationScript,
} from "./ssr.service";

describe("SSR Service", () => {
	beforeEach(() => {
		setSSRContext(null);
	});

	describe("createSSRContext", () => {
		it("should create server context", () => {
			const context = createSSRContext({ isServer: true });

			expect(context.isServer).toBe(true);
		});

		it("should create client context", () => {
			const context = createSSRContext({ isServer: false });

			expect(context.isServer).toBe(false);
		});
	});

	describe("getSSRContext", () => {
		it("should return current context", () => {
			const context = createSSRContext({ isServer: true });
			setSSRContext(context);

			expect(getSSRContext()).toBe(context);
		});

		it("should return null if no context", () => {
			expect(getSSRContext()).toBeNull();
		});
	});

	describe("setSSRContext", () => {
		it("should set context", () => {
			const context = createSSRContext({ isServer: true });
			setSSRContext(context);

			expect(getSSRContext()).toBe(context);
		});
	});

	describe("withSSRContext", () => {
		it("should run function with context", () => {
			const context = createSSRContext({ isServer: true });

			const result = withSSRContext(context, () => {
				return getSSRContext()?.isServer;
			});

			expect(result).toBe(true);
		});

		it("should restore previous context", () => {
			const context1 = createSSRContext({ isServer: true });
			const context2 = createSSRContext({ isServer: false });

			setSSRContext(context1);

			withSSRContext(context2, () => {
				expect(getSSRContext()?.isServer).toBe(false);
			});

			expect(getSSRContext()?.isServer).toBe(true);
		});
	});

	describe("isServerSide", () => {
		it("should return true for server context", () => {
			const context = createSSRContext({ isServer: true });
			setSSRContext(context);

			expect(isServerSide()).toBe(true);
		});

		it("should return false for client context", () => {
			const context = createSSRContext({ isServer: false });
			setSSRContext(context);

			expect(isServerSide()).toBe(false);
		});

		it("should return true when no context and window is undefined", () => {
			const originalWindow = globalThis.window;
			delete (globalThis as any).window;

			expect(isServerSide()).toBe(true);

			globalThis.window = originalWindow;
		});
	});

	describe("isClientSide", () => {
		it("should return false for server context", () => {
			const context = createSSRContext({ isServer: true });
			setSSRContext(context);

			expect(isClientSide()).toBe(false);
		});

		it("should return true for client context", () => {
			const context = createSSRContext({ isServer: false });
			setSSRContext(context);

			expect(isClientSide()).toBe(true);
		});
	});

	describe("getSSRScriptTag", () => {
		it("should generate script tag", () => {
			const state = {
				signals: [{ id: "test-1", value: 42, version: Date.now() }],
				version: "1.0.0",
				timestamp: Date.now(),
			};

			const scriptTag = getSSRScriptTag(state);

			expect(scriptTag).toContain("<script>");
			expect(scriptTag).toContain("window.__SIGNAL_STATE__");
			expect(scriptTag).toContain("42");
		});
	});

	describe("getHydrationScript", () => {
		it("should generate hydration script", () => {
			const script = getHydrationScript();

			expect(script).toContain("<script>");
			expect(script).toContain("window.__SIGNAL_STATE__");
			expect(script).toContain("Hydrating signals");
		});
	});
});
