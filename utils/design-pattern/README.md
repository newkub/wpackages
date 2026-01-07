# Design Pattern Library

A collection of design patterns implemented in modern TypeScript.

## Implemented Patterns

### Creational Patterns

- Singleton
- Factory Method
- Abstract Factory
- Builder
- Prototype
- Object Pool

### Structural Patterns

- Adapter
- Bridge
- Composite
- Decorator
- Facade
- Flyweight
- Proxy

### Behavioral Patterns

- Chain of Responsibility
- Command
- Iterator
- Mediator
- Memento
- Observer
- State
- Strategy
- Template Method
- Visitor

## Project Structure

Each design pattern is organized into its own directory within `src/`. Each directory contains:

- `index.ts`: The core implementation of the pattern.
- `[pattern-name].test.ts`: Unit tests for the pattern.
- `[pattern-name].usage.ts`: A runnable usage example.

## Usage

All patterns are exported from the main `src/index.ts` file. You can import them as follows:

```typescript
import { Singleton } from "@wpackages/design-pattern";
```

To run a specific usage example:

```bash
bun src/singleton/singleton.usage.ts
```
