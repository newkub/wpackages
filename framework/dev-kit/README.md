# @wpackages/dev-kit

## Introduction

`@wpackages/dev-kit` is a comprehensive meta-package that provides a unified interface for development tools and utilities. It aggregates and re-exports all development-related packages from the wpackages monorepo, offering developers a single entry point to access powerful tools for testing, TypeScript building, code formatting, and reporting. Designed to streamline the development workflow, this kit ensures consistency, reliability, and efficiency across all development tasks.

## Features

- 🧪 **Testing Utilities**: Comprehensive testing framework with powerful assertion and mocking capabilities
- 🔨 **TypeScript Build**: Advanced TypeScript build tools with watch mode and incremental compilation
- 🎨 **Code Formatter**: Intelligent code formatter with support for multiple languages and styles
- 📊 **Reporting Tools**: Flexible reporting system for build results, test coverage, and metrics
- ⚡ **Performance**: Optimized tools for fast development cycles
- 🔧 **Configurable**: Highly configurable to fit any project's needs
- 🎯 **Type-Safe**: Full TypeScript support with type inference
- 🧩 **Integratable**: Works seamlessly with popular CI/CD systems
- 📏 **Consistent**: Uniform patterns across all development tools

## Goal

- 🎯 **Unified Development**: Provide a single, consistent API for all development tooling needs
- 🛡️ **Reliability**: Ensure all tools are robust and production-ready
- 🤸 **Flexibility**: Enable developers to customize tools for their specific workflows
- 🧑‍💻 **Superior DX**: Make development tasks as efficient and enjoyable as possible
- ✅ **Quality**: Maintain high code quality through automated tooling

## Design Principles

- 🏛️ **Developer First**: Tools are designed with developer experience as the top priority
- 🧩 **Composability**: Tools work together seamlessly and can be composed as needed
- 📏 **Consistency**: Maintain uniform patterns and conventions across all tools
- 🔒 **Type Safety**: Leverage TypeScript's type system for compile-time safety
- ⚡ **Performance**: Optimize for speed without sacrificing functionality
- 🎨 **User-Friendly**: APIs should be intuitive and well-documented

## Installation

This is a workspace package. Ensure you have installed dependencies from the monorepo root:

```bash
bun install
```

## Usage

### Testing

Write and run tests with comprehensive utilities:

```typescript
import { describe, it, expect, mock, beforeEach, afterEach } from "@wpackages/dev-kit";

describe("Calculator", () => {
	let calculator: Calculator;

	beforeEach(() => {
		calculator = new Calculator();
	});

	afterEach(() => {
		calculator.dispose();
	});

	it("should add two numbers", () => {
		const result = calculator.add(2, 3);
		expect(result).toBe(5);
	});

	it("should subtract two numbers", () => {
		const result = calculator.subtract(5, 3);
		expect(result).toBe(2);
	});

	it("should handle async operations", async () => {
		const result = await calculator.asyncAdd(2, 3);
		expect(result).toBe(5);
	});
});
```

### TypeScript Build

Build TypeScript projects with advanced features:

```typescript
import { Builder, Watcher } from "@wpackages/dev-kit";

const builder = Builder.create({
	entry: "src/index.ts",
	outDir: "dist",
	target: "es2020",
	declaration: true,
	sourceMap: true,
});

// Single build
await builder.build();

// Watch mode
const watcher = Watcher.create({
	...builder.options,
	onChange: (event) => {
		console.log(`File changed: ${event.file}`);
	},
});

await watcher.start();
```

### Code Formatting

Format code with intelligent rules:

```typescript
import { Formatter } from "@wpackages/dev-kit";

const formatter = Formatter.create({
	style: "prettier",
	options: {
		tabWidth: 2,
		useTabs: false,
		semi: true,
		singleQuote: true,
		trailingComma: "es5",
	},
});

// Format a file
await formatter.formatFile("src/index.ts");

// Format multiple files
await formatter.format("src/**/*.ts");

// Format with custom options
await formatter.format("src/**/*.ts", {
	printWidth: 100,
	tabWidth: 4,
});
```

### Reporting

Generate reports for various metrics:

```typescript
import { Reporter } from "@wpackages/dev-kit";

const reporter = Reporter.create({
	format: "json",
	output: "reports",
});

// Build report
const buildReport = reporter.createBuildReport({
	status: "success",
	duration: 1234,
	files: 42,
	errors: 0,
	warnings: 3,
});

await reporter.save(buildReport);

// Test coverage report
const coverageReport = reporter.createCoverageReport({
	coverage: 85.5,
	coveredLines: 850,
	totalLines: 1000,
	uncoveredFiles: ["src/legacy.ts"],
});

await reporter.save(coverageReport);

// Custom report
const customReport = reporter.createReport({
	type: "custom",
	data: {
		metric1: 100,
		metric2: 200,
	},
});

await reporter.save(customReport);
```

## Examples

### Complete Test Suite

```typescript
import { describe, it, expect, mock, beforeEach, afterEach, vi } from "@wpackages/dev-kit";

describe("UserService", () => {
	let userService: UserService;
	let mockApi: ReturnType<typeof mock>;

	beforeEach(() => {
		mockApi = mock.fn();
		userService = new UserService(mockApi);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe("getUser", () => {
		it("should fetch user by ID", async () => {
			const mockUser = { id: 1, name: "Alice" };
			mockApi.mockResolvedValue(mockUser);

			const user = await userService.getUser(1);

			expect(user).toEqual(mockUser);
			expect(mockApi).toHaveBeenCalledWith("/users/1");
		});

		it("should handle API errors", async () => {
			mockApi.mockRejectedValue(new Error("Network error"));

			await expect(userService.getUser(1)).rejects.toThrow("Network error");
		});
	});

	describe("createUser", () => {
		it("should create a new user", async () => {
			const newUser = { name: "Bob", email: "bob@example.com" };
			const createdUser = { id: 2, ...newUser };
			mockApi.mockResolvedValue(createdUser);

			const result = await userService.createUser(newUser);

			expect(result).toEqual(createdUser);
			expect(mockApi).toHaveBeenCalledWith("/users", {
				method: "POST",
				body: JSON.stringify(newUser),
			});
		});
	});
});
```

### Build Pipeline with Reporting

```typescript
import { Builder, Formatter, Reporter } from "@wpackages/dev-kit";

async function buildPipeline() {
	const reporter = Reporter.create({
		format: "json",
		output: "reports",
	});

	const startTime = Date.now();

	try {
		// Format code
		console.log("Formatting code...");
		await Formatter.create().format("src/**/*.ts");

		// Build TypeScript
		console.log("Building TypeScript...");
		const builder = Builder.create({
			entry: "src/index.ts",
			outDir: "dist",
			declaration: true,
			sourceMap: true,
		});

		const buildResult = await builder.build();

		// Generate report
		const report = reporter.createBuildReport({
			status: "success",
			duration: Date.now() - startTime,
			files: buildResult.files,
			errors: buildResult.errors.length,
			warnings: buildResult.warnings.length,
		});

		await reporter.save(report);
		console.log("Build completed successfully!");
	} catch (error) {
		const report = reporter.createBuildReport({
			status: "failed",
			duration: Date.now() - startTime,
			files: 0,
			errors: 1,
			warnings: 0,
		});

		await reporter.save(report);
		throw error;
	}
}

buildPipeline();
```

### Watch Mode with Hot Reload

```typescript
import { Watcher, Formatter } from "@wpackages/dev-kit";

const watcher = Watcher.create({
	entry: "src/index.ts",
	outDir: "dist",
	onChange: async (event) => {
		console.log(`File changed: ${event.file}`);

		// Format the changed file
		await Formatter.create().formatFile(event.file);

		// Rebuild
		console.log("Rebuilding...");
		// Trigger rebuild logic here
	},
	onError: (error) => {
		console.error("Build error:", error);
	},
	onSuccess: () => {
		console.log("Build successful!");
	},
});

await watcher.start();
```

### Custom Test Runner

```typescript
import { TestRunner, Reporter } from "@wpackages/dev-kit";

async function runTests() {
	const runner = TestRunner.create({
		pattern: "src/**/*.test.ts",
		coverage: true,
		verbose: true,
	});

	const reporter = Reporter.create({
		format: "json",
		output: "reports",
	});

	const results = await runner.run();

	const report = reporter.createCoverageReport({
		coverage: results.coverage.percentage,
		coveredLines: results.coverage.coveredLines,
		totalLines: results.coverage.totalLines,
		uncoveredFiles: results.coverage.uncoveredFiles,
	});

	await reporter.save(report);

	console.log(`Tests passed: ${results.passed}/${results.total}`);
	console.log(`Coverage: ${results.coverage.percentage}%`);
}

runTests();
```

## License

MIT
