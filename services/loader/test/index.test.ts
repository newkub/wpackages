import { beforeEach, describe, expect, test, vi } from "bun:test";
import { Loader } from "../src";

// Mock the 'ora' library
const mockOraInstance = {
	start: vi.fn(),
	stop: vi.fn(),
	succeed: vi.fn(),
	fail: vi.fn(),
	warn: vi.fn(),
	info: vi.fn(),
	text: "",
};

vi.mock("ora", () => ({
	default: vi.fn(() => mockOraInstance),
	oraPromise: vi.fn((action) => action),
}));

describe("Loader", () => {
	beforeEach(() => {
		// Clear mock history before each test
		vi.clearAllMocks();
	});

	test("constructor should create an ora instance", async () => {
		const ora = await import("ora");
		new Loader("Initializing...");
		expect(ora.default).toHaveBeenCalledWith("Initializing...");
	});

	test("text getter/setter should work correctly", () => {
		const loader = new Loader();
		loader.text = "New Text";
		expect(mockOraInstance.text).toBe("New Text");
		// Also test the getter
		mockOraInstance.text = "Fetched Text";
		expect(loader.text).toBe("Fetched Text");
	});

	test("start should call ora.start", () => {
		const loader = new Loader();
		loader.start("Starting...");
		expect(mockOraInstance.start).toHaveBeenCalledWith("Starting...");
	});

	test("stop should call ora.stop", () => {
		const loader = new Loader();
		loader.stop();
		expect(mockOraInstance.stop).toHaveBeenCalled();
	});

	test("succeed should call ora.succeed", () => {
		const loader = new Loader();
		loader.succeed("Success!");
		expect(mockOraInstance.succeed).toHaveBeenCalledWith("Success!");
	});

	test("fail should call ora.fail", () => {
		const loader = new Loader();
		loader.fail("Failure!");
		expect(mockOraInstance.fail).toHaveBeenCalledWith("Failure!");
	});

	test("warn should call ora.warn", () => {
		const loader = new Loader();
		loader.warn("Warning!");
		expect(mockOraInstance.warn).toHaveBeenCalledWith("Warning!");
	});

	test("info should call ora.info", () => {
		const loader = new Loader();
		loader.info("Information!");
		expect(mockOraInstance.info).toHaveBeenCalledWith("Information!");
	});

	test("Loader.promise should call oraPromise", async () => {
		const ora = await import("ora");
		const promise = Promise.resolve("Done");
		await Loader.promise(promise, "Processing...");
		expect(ora.oraPromise).toHaveBeenCalledWith(promise, "Processing...");
	});
});
