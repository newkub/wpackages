# @wpackages/web-kit

## Introduction

`@wpackages/web-kit` is a meta-package that provides a unified interface for building modern web applications and APIs. It aggregates and re-exports web-related packages from the wpackages monorepo, offering a single entry point to access API building, server/runtime primitives, routing, validation, and plugin systems.

## Features

- 🚀 **API Builder**: Build robust, type-safe APIs with Effect-TS integration
- 🌐 **Web Server**: Bun.serve-based web server primitives via `@wpackages/webserver`
- 🛣️ **Routing**: File routing and routing utilities via `@wpackages/wrouter`
- 🔌 **Plugin System**: Extensible architecture for adding custom functionality
- 🧪 **Validation**: Schema + validator utilities via `@wpackages/schema` and `@wpackages/validator`
- 🧩 **Functional Programming**: All components are designed as Effects for composability
- 🎯 **Middleware Pipeline**: Powerful middleware system for request/response processing
- 🌍 **Cross-Platform**: Works seamlessly with Bun runtime

## Goal

- 🎯 **Unified Web Development**: Provide a single, consistent API for all web development needs
- 🛡️ **Robustness**: Eliminate runtime errors through powerful type systems and functional constructs
- 🤸 **Flexibility**: Enable developers to build everything from simple APIs to complex web applications
- 🧑‍💻 **Superior DX**: Make building web apps as enjoyable as building modern CLIs
- ✅ **Observability**: Built-in tracing and monitoring capabilities out of the box

## Design Principles

- 🏛️ **Effect-Driven**: All side effects are managed through the Effect system for interruptibility and resource safety
- 🧩 **Composability**: Components are designed to be composable, enabling reusable patterns
- 📏 **Consistency**: Maintain uniform patterns and conventions across all web components
- 🔒 **Type Safety First**: Leverage TypeScript's type system to catch errors at compile time
- 🌐 **HTTP Standards**: Follow HTTP standards and best practices
- 🔌 **Extensibility**: Plugin system allows for easy extension and customization

## Installation

This is a workspace package. Ensure you have installed dependencies from the monorepo root:

```bash
bun install
```

## Usage

### API Builder

Build type-safe APIs with Effect-TS:

```typescript
import { ApiBuilder } from "@wpackages/web-kit";
import { Effect } from "effect";

const api = ApiBuilder.create({
	routes: [
		{
			method: "GET",
			path: "/users",
			handler: Effect.succeed({ users: [{ id: 1, name: "Alice" }] }),
		},
		{
			method: "POST",
			path: "/users",
			handler: (req) => Effect.succeed({ id: 2, ...req.body }),
		},
	],
});

Effect.runPromise(api.start({ port: 3000 }));
```

### Web Server

Create a web server (Bun runtime) with routing and middleware:

```typescript
import { WebServer } from "@wpackages/web-kit";

const app = WebServer.createWebServer({ port: 3000, host: "localhost" });

app.get("/", () => ({ message: "Hello World" }));
app.get("/health", () => ({ status: "ok" }));

await app.start();
```

### Validation

Use schema + validator utilities:

```typescript
import { Schema, Validator } from "@wpackages/web-kit";

// Use Schema / Validator exports from their respective packages
// depending on your chosen validation strategy.
void Schema;
void Validator;
```

### Plugin System

Extend functionality with plugins:

```typescript
import { PluginsSystem } from "@wpackages/web-kit";
import { Effect } from "effect";

const manager = PluginsSystem.createManager();

const authPlugin = PluginsSystem.createPlugin({
	name: "auth",
	setup: (context) =>
		Effect.sync(() => {
			console.log("Auth plugin initialized");
			return {
				middleware: (req, next) => {
					// Add auth logic
					return next(req);
				},
			};
		}),
});

Effect.runPromise(manager.register(authPlugin));
```

## Examples

### Complete REST API

```typescript
import { ApiBuilder } from "@wpackages/web-kit";
import { Effect } from "effect";

const api = ApiBuilder.create({
	name: "todo-api",
	version: "1.0.0",
	routes: [
		{
			method: "GET",
			path: "/todos",
			handler: Effect.succeed([
				{ id: 1, title: "Buy groceries", completed: false },
				{ id: 2, title: "Walk the dog", completed: true },
			]),
		},
		{
			method: "GET",
			path: "/todos/:id",
			handler: (req) =>
				Effect.succeed({
					id: req.params.id,
					title: "Sample Todo",
					completed: false,
				}),
		},
		{
			method: "POST",
			path: "/todos",
			handler: (req) =>
				Effect.succeed({
					id: Date.now(),
					...req.body,
					completed: false,
				}),
		},
	],
});

Effect.runPromise(api.start({ port: 3000 }));
```

## License

MIT
