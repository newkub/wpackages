# @wpackages/web-kit

## Introduction

`@wpackages/web-kit` is a comprehensive meta-package that provides a unified interface for building modern web applications and APIs. It aggregates and re-exports all web-related packages from the wpackages monorepo, offering developers a single entry point to access powerful tools for API development, HTTP handling, routing, server management, plugin systems, and distributed tracing. Built with Effect-TS at its core, this kit ensures type-safety, functional programming patterns, and robust error handling throughout the web development lifecycle.

## Features

- 🚀 **API Builder**: Build robust, type-safe APIs with Effect-TS integration
- 🌐 **HTTP Client & Server**: Complete HTTP stack with client utilities and server implementation
- 🛣️ **Advanced Routing**: Flexible HTTP routing with middleware support
- 🔌 **Plugin System**: Extensible architecture for adding custom functionality
- 📊 **Distributed Tracing**: Built-in tracing support for observability and debugging
- 🔒 **Type-Safe**: Leverages Effect-TS and @effect/schema for compile-time validation
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

### HTTP Server

Create HTTP servers with routing and middleware:

```typescript
import { HttpServer, HttpRouting } from "@wpackages/web-kit";
import { Effect } from "effect";

const server = HttpServer.create({
	port: 3000,
	routes: [
		{
			method: "GET",
			path: "/",
			handler: () => Effect.succeed(new Response("Hello World")),
		},
		{
			method: "GET",
			path: "/api/data",
			handler: () => Effect.succeed(Response.json({ data: "test" })),
		},
	],
});

Effect.runPromise(server.start());
```

### HTTP Client

Make HTTP requests with type-safe responses:

```typescript
import { Http } from "@wpackages/web-kit";
import { Effect } from "effect";

const fetchData = Effect.gen(function*() {
	const response = yield* Http.get("https://api.example.com/data");
	const data = yield* Http.fromJson(response);
	return data;
});

Effect.runPromise(fetchData);
```

### Plugin System

Extend functionality with plugins:

```typescript
import { PluginsSystem } from "@wpackages/web-kit";
import { Effect } from "effect";

const manager = PluginsSystem.createManager();

const authPlugin = PluginsSystem.createPlugin({
	name: "auth",
	setup: (context) => Effect.sync(() => {
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

### Distributed Tracing

Track requests across services:

```typescript
import { Tracing } from "@wpackages/web-kit";
import { Effect } from "effect";

const tracer = Tracing.createTracer({ serviceName: "my-app" });

const handleRequest = Effect.gen(function*() {
	const span = yield* Tracing.startSpan("handle-request");
	yield* Tracing.setAttribute("user.id", "123");
	// ... handle request
	yield* Tracing.endSpan();
});

Effect.runPromise(handleRequest.pipe(
	Effect.provideService(Tracing.Tracer, tracer),
));
```

## Examples

### Complete REST API

```typescript
import { ApiBuilder, Http, HttpRouting } from "@wpackages/web-kit";
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
			handler: (req) => Effect.succeed({
				id: req.params.id,
				title: "Sample Todo",
				completed: false,
			}),
		},
		{
			method: "POST",
			path: "/todos",
			handler: (req) => Effect.succeed({
				id: Date.now(),
				...req.body,
				completed: false,
			}),
		},
	],
});

Effect.runPromise(api.start({ port: 3000 }));
```

### Server with Middleware and Tracing

```typescript
import { HttpServer, HttpRouting, Tracing } from "@wpackages/web-kit";
import { Effect } from "effect";

const tracer = Tracing.createTracer({ serviceName: "web-server" });

const loggingMiddleware = (req, next) => Effect.gen(function*() {
	console.log(`${req.method} ${req.url}`);
	const response = yield* next(req);
	console.log(`Response: ${response.status}`);
	return response;
});

const server = HttpServer.create({
	port: 3000,
	middleware: [loggingMiddleware],
	routes: [
		{
			method: "GET",
			path: "/api/data",
			handler: Effect.gen(function*() {
				const span = yield* Tracing.startSpan("fetch-data");
				const data = yield* Http.get("https://api.example.com/data");
				yield* Tracing.endSpan();
				return Response.json(data);
			}),
		},
	],
});

Effect.runPromise(server.start().pipe(
	Effect.provideService(Tracing.Tracer, tracer),
));
```

### Plugin-Based Application

```typescript
import { PluginsSystem, HttpServer } from "@wpackages/web-kit";
import { Effect } from "effect";

const manager = PluginsSystem.createManager();

const corsPlugin = PluginsSystem.createPlugin({
	name: "cors",
	setup: () => Effect.succeed({
		middleware: (req, next) => Effect.gen(function*() {
			const response = yield* next(req);
			response.headers.set("Access-Control-Allow-Origin", "*");
			return response;
		}),
	}),
});

const authPlugin = PluginsSystem.createPlugin({
	name: "auth",
	setup: () => Effect.succeed({
		middleware: (req, next) => {
			if (!req.headers.get("authorization")) {
				return Effect.succeed(new Response("Unauthorized", { status: 401 }));
			}
			return next(req);
		},
	}),
});

const server = HttpServer.create({
	port: 3000,
	routes: [
		{
			method: "GET",
			path: "/protected",
			handler: Effect.succeed(new Response("Protected data")),
		},
	],
});

Effect.runPromise(
	Effect.gen(function*() {
		yield* manager.register(corsPlugin);
		yield* manager.register(authPlugin);
		yield* server.start();
	}),
);
```

## License

MIT
