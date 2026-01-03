# @wpackages/logger

## Introduction

`@wpackages/logger` provides a structured, level-based, and context-aware logging service built natively for `Effect-TS`. It is designed to be a more powerful and configurable alternative to a basic console service, offering features like log levels, redaction of sensitive data, and structured output.

## Features

- 📝 **Structured Logging**: Outputs logs as structured data (e.g., JSON), making them easy to parse, search, and analyze.
-
  - **Log Levels**: Supports multiple log levels (`debug`, `info`, `warn`, `error`) to control log verbosity.
-
  - **Context-Aware**: Can be enriched with contextual data that is automatically included in all log entries.
-
  - **Data Redaction**: Includes utilities for redacting sensitive information (e.g., passwords, API keys) from logs.
-
  - **`Effect-TS` Native**: Implemented as an `Effect` service for seamless integration, composability, and testability.

## Goal

- 🎯 **Production-Ready Logging**: To provide a robust logging solution suitable for both development and production environments.
-
  - **Actionable Insights**: To produce logs that are rich with context, making it easier to debug issues and understand application behavior.
-
  - **Secure**: To prevent sensitive data from being leaked into logs through built-in redaction capabilities.

## Design Principles

- **Service-Oriented**: Logging is modeled as a service (`Logger`) that can be provided via a `Layer` (`LoggerLive`).
- **Structured by Default**: The logger is designed to produce structured data, not just plain text strings.
- **Extensible**: The core logger can be extended with different formatters and sinks for various output targets.

## Installation

This is an internal workspace package. Ensure you have installed dependencies from the monorepo root:

```bash
bun install
```

## Usage

The service is used by accessing the `Logger` from the `Effect` context.

### Example: Basic Logging

```typescript
import { Logger, LoggerLive } from "@wpackages/logger";
import { Effect, Layer } from "effect";

// 1. Define a program that uses the Logger service
const program = Effect.gen(function*() {
	const logger = yield* Logger;

	yield* logger.info("Application starting up", { pid: process.pid });
	yield* logger.warn("Configuration is missing a value", { key: "API_URL" });

	// This debug log might be filtered out depending on the configured log level
	yield* logger.debug("Entering critical section");
});

// 2. Create a live layer with a minimum log level
const loggerLive = LoggerLive.layer({ level: "info" });

// 3. Provide the layer and run the program
const runnable = Effect.provide(program, loggerLive);

Effect.runPromise(runnable);
```

## License

This project is licensed under the MIT License.
