# @wpackages/cli-kit

## Introduction

`@wpackages/cli-kit` is a comprehensive meta-package that provides a unified interface for building command-line interfaces. It aggregates and re-exports all CLI-related packages from the wpackages monorepo, offering developers a single entry point to access powerful tools for CLI development, terminal UI components, interactive prompts, and configuration management. Built with Effect-TS at its core, this kit ensures type-safety, functional programming patterns, and robust error handling throughout the CLI development lifecycle.

## Features

- 🎭 **Dual Mode Execution**: Seamlessly switch between traditional flag-based command execution and modern interactive prompt-based flows
- 🔒 **Type-Safe Development**: Leverages Effect-TS and @effect/schema for compile-time validation of commands, options, and arguments
- 🧩 **Functional Programming**: All components are designed as Effects, enabling composability, testability, and interruptible operations
- 🎨 **Rich Terminal UI**: Comprehensive library of display components including tables, spinners, progress bars, and status messages
- 💬 **Interactive Prompts**: Extensive collection of prompt components powered by Ink.js and React for beautiful user interactions
- ⚙️ **Configuration Management**: Multi-source configuration loading with validation, environment variable expansion, and hot-reload support
- 🌳 **Command Nesting**: Support for deeply nested command structures (e.g., `git remote add`) for complex CLI applications
- 🪝 **Lifecycle Hooks**: Global and command-specific before/after hooks for implementing middleware-like functionality
- 🎯 **Developer Experience**: Clean, declarative API that eliminates boilerplate and accelerates development

## Goal

- 🎯 **Unified CLI Development**: Provide a single, consistent API for all CLI development needs without managing multiple package dependencies
- 🛡️ **Robustness**: Eliminate runtime errors through powerful type systems and functional programming constructs
- 🤸 **Flexibility**: Enable developers to build everything from simple scripts to complex, interactive command-line applications with the same tool
- 🧑‍💻 **Superior DX**: Make building CLIs as enjoyable and intuitive as building modern web applications
- ✅ **Testability**: Ensure all CLI components are fully testable through Effect-based architecture

## Design Principles

- 🏛️ **Configuration as Code**: CLIs are defined declaratively using TypeScript objects, making them easy to read, modify, and extend
- 💫 **Effect-Driven**: All side effects (file system access, network requests, user input) are managed through the Effect system for interruptibility and resource safety
- 🧩 **Composability**: Commands, options, and UI components are designed to be composable, enabling reusable CLI patterns
- 📏 **Consistency**: Maintain uniform patterns and conventions across all CLI components
- 🔒 **Type Safety First**: Leverage TypeScript's type system to catch errors at compile time
- 🎨 **User-Centric**: Components prioritize clarity, feedback, and ease of use for end users

## Installation

This is a workspace package. Ensure you have installed dependencies from the monorepo root:

```bash
bun install
```

## Usage

### CLI Builder

Build command-line interfaces with full type-safety and Effect-TS integration:

```typescript
import { createCli } from "@wpackages/cli-kit";
import { Effect } from "effect";

const config = {
	name: "my-cli",
	version: "1.0.0",
	description: "My awesome CLI application",
	commands: [
		{
			name: "hello",
			description: "Prints a greeting",
			options: [
				{
					name: "name",
					shorthand: "n",
					description: "The name to greet",
					type: "string",
					defaultValue: "World",
				},
			],
			action: ({ options }) => {
				console.log(`Hello, ${options.name}!`);
			},
		},
	],
};

const cli = createCli(config);
Effect.runPromise(cli.run);
```

### Terminal UI Components

Display information beautifully with TUI components:

```typescript
import { components } from "@wpackages/cli-kit";
import { Effect } from "effect";

const program = Effect.gen(function*() {
	// Display a table
	yield* components.display.table([
		{ id: 1, name: "Alice", role: "Admin" },
		{ id: 2, name: "Bob", role: "User" },
		{ id: 3, name: "Charlie", role: "User" },
	]);

	// Show a spinner during long operations
	yield* components.display.spinner("Processing data...");

	// Display status messages
	yield* components.display.success("Operation completed!");
	yield* components.display.error("Something went wrong!");
});
```

### Interactive Prompts

Create beautiful interactive prompts with Ink.js and React:

```typescript
import { prompt, TextPrompt, ConfirmPrompt, SelectPrompt } from "@wpackages/cli-kit";

async function main() {
	// Text input
	const name = await prompt(TextPrompt, {
		message: "What is your name?",
		placeholder: "Type here...",
	});

	// Confirmation
	const confirmed = await prompt(ConfirmPrompt, {
		message: "Do you want to continue?",
		defaultValue: false,
	});

	// Select from options
	const framework = await prompt(SelectPrompt, {
		message: "Choose a framework",
		options: [
			{ label: "React", value: "react" },
			{ label: "Vue", value: "vue" },
			{ label: "Angular", value: "angular" },
		],
	});

	console.log(`Hello ${name}, you chose ${framework}`);
}
```

### Configuration Management

Load and validate configuration from multiple sources:

```typescript
import { createConfigManager } from "@wpackages/cli-kit";

interface AppConfig {
	port: number;
	apiKey: string;
	debug: boolean;
}

const configManager = createConfigManager<AppConfig>({
	schema: {
		port: { type: "number", required: true, env: "PORT" },
		apiKey: { type: "string", required: true, env: "API_KEY" },
		debug: { type: "boolean", required: false, defaultValue: false },
	},
});

async function start() {
	const { config } = await configManager.load();
	console.log(`Starting server on port ${config.port}`);
}
```

## Examples

### Complete CLI Application

```typescript
import { createCli, components, prompt, TextPrompt } from "@wpackages/cli-kit";
import { Effect } from "effect";

const config = {
	name: "todo-cli",
	version: "1.0.0",
	description: "A simple todo CLI",
	commands: [
		{
			name: "add",
			description: "Add a new todo",
			action: async () => {
				const task = await prompt(TextPrompt, {
					message: "Enter the task:",
				});
				yield* components.display.success(`Added: ${task}`);
			},
		},
		{
			name: "list",
			description: "List all todos",
			action: () => {
				yield* components.display.table([
					{ id: 1, task: "Buy groceries", done: false },
					{ id: 2, task: "Walk the dog", done: true },
				]);
			},
		},
	],
};

const cli = createCli(config);
Effect.runPromise(cli.run);
```

### Interactive CLI with Configuration

```typescript
import { createCli, createConfigManager, components, prompt, TextPrompt } from "@wpackages/cli-kit";
import { Effect } from "effect";

const configManager = createConfigManager<{ apiKey: string }>({
	schema: {
		apiKey: { type: "string", required: true, env: "API_KEY" },
	},
});

const config = {
	name: "api-cli",
	version: "1.0.0",
	before: async () => {
		const { config } = await configManager.load();
		if (!config.apiKey) {
			const apiKey = await prompt(TextPrompt, {
				message: "Enter your API key:",
			});
			return { apiKey };
		}
		return config;
	},
	commands: [
		{
			name: "fetch",
			description: "Fetch data from API",
			action: async ({ context }) => {
				yield* components.display.spinner("Fetching data...");
				// Fetch using context.apiKey
				yield* components.display.success("Data fetched!");
			},
		},
	],
};

const cli = createCli(config);
Effect.runPromise(cli.run);
```

## License

MIT
