# @wpackages/http-server

Complete HTTP server stack with routing and response handling built on top of Effect.js.

## Introduction

@wpackages/http-server provides a comprehensive HTTP server infrastructure that combines routing, response handling, and middleware management. Built with Effect.js for type-safe, composable, and testable server applications. This package serves as the foundation for building scalable and maintainable HTTP services with strong type safety and functional programming principles.

## Features

- 🚀 **Effect.js Integration**: Built on Effect.js for composable and type-safe server logic
- 🔧 **Response Factory**: Configurable response handling with security headers support
- 🛣️ **Routing Configuration**: Flexible routing system with extensible configuration
- 🔌 **Middleware Support**: Pluggable middleware architecture for request/response processing
- 📦 **Modular Design**: Separated concerns with clear module boundaries
- 🎯 **Type-Safe**: Full TypeScript support with strict type checking
- 🏗️ **Layer-Based Architecture**: Effect.js Layer pattern for dependency injection

## Goal

- Provide a type-safe HTTP server foundation for building web applications
- Enable composable server logic through Effect.js patterns
- Support flexible routing and middleware systems
- Maintain clean separation of concerns across server components
- Facilitate testing and maintainability of server code

## Design Principles

- **Type Safety First**: Leverage TypeScript and Effect.js for compile-time guarantees
- **Composability**: Build complex servers from simple, composable pieces
- **Separation of Concerns**: Clear boundaries between routing, response handling, and middleware
- **Dependency Injection**: Use Effect.js Layers for managing dependencies
- **Extensibility**: Easy to extend with custom middleware, routes, and response handlers
- **Testability**: Design with testing in mind using Effect.js testing utilities

## Installation

```bash
# Using bun
bun add @wpackages/http-server

# Using npm
npm install @wpackages/http-server

# Using yarn
yarn add @wpackages/http-server

# Using pnpm
pnpm add @wpackages/http-server
```

## Usage

### Basic Setup

```typescript
import { createHttpServer } from "@wpackages/http-server";
import { Layer } from "effect";

const config = {
  port: 3000,
  host: "localhost"
};

const options = {
  withSecurityHeaders: true
};

const httpServer = createHttpServer(config, options);
```

### Using Response Factory

```typescript
import { ResponseFactory, ResponseFactoryLive } from "@wpackages/http-server";
import { Layer } from "effect";

const responseLayer = ResponseFactoryLive({
  withSecurityHeaders: true
});

// Use in your Effect program
const program = ResponseFactory.pipe(
  Effect.map(factory => ({
    createResponse: (data: unknown) => factory.options
  }))
);
```

### Using Routing Configuration

```typescript
import { HttpRoutingConfig, HttpRoutingConfigLive } from "@wpackages/http-server";
import { Layer } from "effect";

const routingConfig = {
  routes: {
    "/api": "apiHandler",
    "/health": "healthHandler"
  },
  middleware: ["logging", "cors"]
};

const routingLayer = HttpRoutingConfigLive(routingConfig);
```

### Complete Server Setup

```typescript
import { createHttpServer } from "@wpackages/http-server";
import { Effect, Layer } from "effect";

const config = {
  port: 3000,
  host: "localhost"
};

const options = {
  withSecurityHeaders: true
};

const serverLayer = createHttpServer(config, options);

const program = Effect.gen(function* () {
  const server = yield* serverLayer;
  console.log("Server started successfully");
});
```

## Examples

### Simple HTTP Server

```typescript
import { createHttpServer } from "@wpackages/http-server";
import { Effect, Layer } from "effect";

const config = {
  port: 3000,
  host: "localhost"
};

const options = {
  withSecurityHeaders: true
};

const serverLayer = createHttpServer(config, options);

const main = Effect.gen(function* () {
  console.log("Server is running on http://localhost:3000");
});

Effect.runPromise(Layer.launch(serverLayer)(main));
```

### Server with Custom Middleware

```typescript
import { appMiddleware } from "@wpackages/http-server";

const customMiddleware = {
  ...appMiddleware,
  logging: true,
  cors: {
    origin: "*"
  }
};
```

### Security Headers Configuration

```typescript
import { ResponseFactoryLive } from "@wpackages/http-server";

const responseLayer = ResponseFactoryLive({
  withSecurityHeaders: true
});

// This will automatically add security headers like:
// - X-Content-Type-Options: nosniff
// - X-Frame-Options: DENY
// - X-XSS-Protection: 1; mode=block
```

## License

MIT License - see LICENSE file for details
