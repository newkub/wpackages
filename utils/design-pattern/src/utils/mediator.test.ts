import { describe, expect, it, vi } from "vitest";
import { mediator } from "./mediator";

describe("mediator", () => {
	it("should send message between participants", () => {
		const med = mediator();
		const receiver1 = vi.fn();
		const receiver2 = vi.fn();

		med.register("user1", receiver1);
		med.register("user2", receiver2);

		med.send("user1", "user2", "Hello");

		expect(receiver2).toHaveBeenCalledWith("[user1] Hello");
		expect(receiver1).not.toHaveBeenCalled();
	});

	it("should broadcast message to all participants", () => {
		const med = mediator();
		const receiver1 = vi.fn();
		const receiver2 = vi.fn();
		const receiver3 = vi.fn();

		med.register("user1", receiver1);
		med.register("user2", receiver2);
		med.register("user3", receiver3);

		med.broadcast("user1", "Broadcast message");

		expect(receiver1).not.toHaveBeenCalled();
		expect(receiver2).toHaveBeenCalledWith("[user1] Broadcast message");
		expect(receiver3).toHaveBeenCalledWith("[user1] Broadcast message");
	});
});
