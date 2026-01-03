# @wpackages/console

## Introduction

`@wpackages/console` provides pre-configured `Effect.Logger` layers for standardized logging across the monorepo. It leverages the powerful, built-in logging capabilities of `Effect` to offer structured, configurable, and environment-aware logging out of the box.

## Features

- 💅 **Pretty Logging**: A `PrettyLoggerLive` layer for beautiful, human-readable console output during development.
- 🔲 **JSON Logging**: A `JsonLoggerLive` layer for structured, machine-readable logs suitable for production environments.
- 🔧 **Configurable**: Easily configure the minimum log level for each logger.
- 🧩 **Effect-Native**: Built directly on top of `Effect.Logger`, ensuring seamless integration with the entire Effect ecosystem.

## Goal

- 🎯 **Standardize Logging**: To provide a consistent, centralized way to configure and use logging across all packages in the monorepo.
- ✅ **Environment-Specific Defaults**: To offer sensible defaults for both development (pretty) and production (JSON) environments.
- 🧑‍💻 **Improve Observability**: To enable structured logging that can be easily parsed, searched, and analyzed by logging platforms.

## Design Principles

- **Layer-Based Configuration**: Logging behavior is configured and provided to the application via `Effect.Layer`.
- **Leverage Effect's Power**: Instead of reinventing the wheel, this package embraces and exposes the rich features of `Effect.Logger`.
- **Simplicity**: The API is minimal and focuses on providing the right logger for the right environment.

## Installation

This is a workspace package. Ensure you have installed dependencies from the monorepo root:

```bash
bun install
```

## Usage

To use the loggers, provide one of the exported layers to your application's main effect.

### Example: Using the Pretty Logger for Development

```typescript
import { PrettyLoggerLive } from "@wpackages/console";
import { Effect, Logger } from "effect";

// 1. Define a program that logs messages
const program = Effect.gen(function*() {
	yield* Effect.logInfo("Application starting...");
	yield* Effect.logDebug("Connecting to database.", { host: "localhost" });
	yield* Effect.logWarning("Deprecated feature in use.");
	yield* Effect.logError("Something went wrong!", new Error("Oops"));
});

// 2. Provide the PrettyLogger layer
// This replaces the default Effect logger with our pretty-printed version
const runnable = Effect.provide(
	program,
	PrettyLoggerLive({ minLevel: "Debug" }),
);

// 3. Run the program
Effect.runPromise(runnable);
```

### Example: Using the JSON Logger for Production

```typescript
import { JsonLoggerLive } from "@wpackages/console";
import { Effect, Logger } from "effect";

const program = Effect.logError("Critical failure in payment processing.");

// In a production environment, you would use the JSON logger
const runnable = Effect.provide(program, JsonLoggerLive);

Effect.runPromise(runnable);
```

## License

This project is licensed under the MIT License.
