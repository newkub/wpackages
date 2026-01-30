# @wpackages/dependency

A minimal, straightforward DI container for TypeScript projects.

## Introduction

`@wpackages/dependency` is a minimal, straightforward dependency injection (DI) container for TypeScript projects. It provides a simple, functional API for managing dependencies and their lifecycles, making it easy to build maintainable and testable applications.

## Features

- **Simple API**: Minimal, easy-to-learn API without complex decorators or configuration
- **Functional Design**: Built with functional programming principles for composability
- **Type-Safe**: Full TypeScript support with compile-time type checking
- **Lightweight**: Zero dependencies for maximum performance
- **Testable**: Easy to mock and test dependencies
- **Scopes**: Support for singleton and transient lifecycles

## Goal

- **Simplify DI**: To provide a simple, straightforward DI container without unnecessary complexity
- **Improve DX**: To make dependency injection easy to use without decorators or complex setup
- **Type Safety**: To ensure all dependencies are type-safe at compile time

## Design Principles

- **Simplicity**: Minimal API that does one thing well
- **Functional**: Functional design for composability and testability
- **Type Safety**: Leverage TypeScript for compile-time guarantees

## Installation

This is a workspace package. Ensure you have installed dependencies from the monorepo root:

```bash
bun install
```

## Usage

### Basic Usage

Create a container and register dependencies:

```typescript
import { createContainer } from "@wpackages/dependency";

// Create a container
const container = createContainer();

// Register a singleton service
container.registerSingleton("database", () => ({
  connect: () => console.log("Connected to database"),
}));

// Register a transient service (new instance each time)
container.registerTransient("logger", () => ({
  log: (message: string) => console.log(message),
}));

// Resolve dependencies
const db = container.resolve("database");
db.connect(); // "Connected to database"

const logger1 = container.resolve("logger");
const logger2 = container.resolve("logger");
console.log(logger1 === logger2); // false (transient)
```

### Dependency Resolution

Dependencies are resolved automatically:

```typescript
interface UserService {
  getUser(id: string): Promise<{ id: string; name: string }>;
}

interface Database {
  query(sql: string): Promise<any[]>;
}

const container = createContainer();

container.registerSingleton("database", () => ({
  query: async (sql: string) => {
    console.log("Executing:", sql);
    return [];
  },
}));

container.registerSingleton("userService", (c) => ({
  getUser: async (id: string) => {
    const db = c.resolve<Database>("database");
    const results = await db.query(`SELECT * FROM users WHERE id = ${id}`);
    return results[0];
  },
}));

const userService = container.resolve<UserService>("userService");
```

## Comparison

| Feature                   | @wpackages/dependency | tsyringe (Microsoft)         | injection-js (from Angular) |
| ------------------------- | --------------------- | ---------------------------- | --------------------------- |
| **API Style**             | Functional / Simple   | Decorator-rich / Fluent API  | Based on Angular v4 API     |
| **Scopes**                | Singleton, Transient  | Singleton, Scoped, Transient | Provider-based              |
| **Optional Dependencies** | ❌ No                 | ✅ Yes                       | ✅ Yes                      |
| **Child Containers**      | ❌ No                 | ✅ Yes                       | ✅ Yes                      |
| **Bundle Size**           | ~2KB                  | ~15KB                        | ~20KB                       |
| **Dependencies**          | Zero                  | reflect-metadata             | reflect-metadata            |

## License

This project is licensed under the MIT License.
