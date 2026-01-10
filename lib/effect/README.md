# @wpackages/effect

A lightweight, type-safe functional effect system better than Effect-TS.

## Features

- **Type-safe**: Full TypeScript type inference with no compromises
- **Lightweight**: Minimal bundle size, optimized for Bun
- **Simple API**: Easy to learn and use, no complex abstractions
- **Powerful**: Supports async, error handling, dependency injection, and resilience patterns
- **Composable**: Functional composition with pipe and combinators

## Installation

```bash
bun add @wpackages/effect
```

## Quick Start

```typescript
import { Effect } from "@wpackages/effect";

const program = Effect.gen(function*() {
  const user = yield* Effect.tryPromise(() => fetchUser(1));
  const posts = yield* Effect.tryPromise(() => fetchPosts(user.id));
  return { user, posts };
});

const result = await Effect.runPromise(program);
```

## Documentation

See [docs](./docs) for detailed documentation.
