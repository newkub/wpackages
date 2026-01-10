import { describe, expect, it } from "vitest";
import { BaseHandler, chain } from "./chain-of-responsibility";

class HandlerA extends BaseHandler {
	handle(request: string): string | null {
		if (request === "A") {
			return "Handled by A";
		}
		return super.handle(request);
	}
}

class HandlerB extends BaseHandler {
	handle(request: string): string | null {
		if (request === "B") {
			return "Handled by B";
		}
		return super.handle(request);
	}
}

class HandlerC extends BaseHandler {
	handle(request: string): string | null {
		if (request === "C") {
			return "Handled by C";
		}
		return super.handle(request);
	}
}

describe("chain-of-responsibility", () => {
	it("should pass request along chain until handled", () => {
		const handlerA = new HandlerA();
		const handlerB = new HandlerB();
		const handlerC = new HandlerC();

		const chainHandler = chain([handlerA, handlerB, handlerC]);

		expect(chainHandler.handle("B")).toBe("Handled by B");
	});

	it("should return null if no handler handles request", () => {
		const handlerA = new HandlerA();
		const handlerB = new HandlerB();

		const chainHandler = chain([handlerA, handlerB]);

		expect(chainHandler.handle("C")).toBeNull();
	});
});
