import { describe, it, expect, vi } from "vitest";
import { Effect, Layer } from "./lib/functional";
import { program } from "./app";
import { Logger, Random } from "./services";
import { TestConfigLive } from "./config/config.test";
import { RandomGenerationError } from "./error";

describe("program", () => {

    // 1. Mock Services
    const mockLogger = {
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        debug: vi.fn(),
        log: vi.fn(),
        child: vi.fn(() => mockLogger), // Return itself for chaining
    };

    const TestLoggerLive = Layer.succeed(Logger, mockLogger);


    it("should log a random number on success", async () => {
        // Arrange
        const TestRandomLive = Layer.succeed(Random, {
            next: () => Effect.succeed(0.5),
        });
        const TestLayer = Layer.merge(TestConfigLive, Layer.merge(TestLoggerLive, TestRandomLive));
        const runnable = Effect.provideLayer(program, TestLayer);

        // Act
        const result = await Effect.runPromise(runnable);

        // Assert
        expect(result).toBeUndefined(); // program returns void on success
        expect(mockLogger.info).toHaveBeenCalledWith("random-number-generated", { number: 0.5 });
    });

    it("should return a RandomGenerationError on failure", async () => {
        // Arrange
        const error = new RandomGenerationError({ reason: "Test failure" });
        const TestRandomLive = Layer.succeed(Random, {
            next: () => Effect.fail(error),
        });
        const TestLayer = Layer.merge(TestConfigLive, Layer.merge(TestLoggerLive, TestRandomLive));
        const runnable = Effect.provideLayer(program, TestLayer);

        // Act
        const result = await Effect.runPromiseEither(runnable);

        // Assert
        expect(result._tag).toBe("Left");
        if (result._tag === "Left") {
            expect(result.left).toBe(error);
        }
        expect(mockLogger.info).not.toHaveBeenCalled();
    });
});
