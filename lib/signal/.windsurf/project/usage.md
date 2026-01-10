# Usage Guide

## Installation

```bash
bun add @wpackages/signal
```

## Basic Usage

### Creating Signals

```typescript
import { createSignal } from "@wpackages/signal";

// Simple signal
const [count, setCount] = createSignal(0);

// Read value
console.log(count()); // 0

// Write value
setCount(1);
console.log(count()); // 1

// With custom equality check
const [items, setItems] = createSignal([], {
  equals: (prev, next) => prev.length === next.length
});
```

### Using Effects

```typescript
import { createEffect, createSignal } from "@wpackages/signal";

const [count, setCount] = createSignal(0);

// Effect runs automatically when count changes
createEffect(() => {
  console.log(`Count is: ${count()}`);
});

setCount(1); // Logs: "Count is: 1"
```

### Cleanup Effects

```typescript
import { createEffect, onCleanup } from "@wpackages/signal";

createEffect(() => {
  const interval = setInterval(() => {
    console.log("Tick");
  }, 1000);

  // Cleanup when effect re-runs or disposes
  onCleanup(() => {
    clearInterval(interval);
  });
});
```

### Computed Values

```typescript
import { createMemo, createSignal } from "@wpackages/signal";

const [count, setCount] = createSignal(0);

// Memoized computed value
const doubled = createMemo(() => count() * 2);

console.log(doubled()); // 0
setCount(5);
console.log(doubled()); // 10
```

### Reactive Objects

```typescript
import { reactive, createEffect } from "@wpackages/signal";

const state = reactive({
  count: 0,
  name: "John"
});

createEffect(() => {
  console.log(state.count, state.name);
});

state.count = 1; // Triggers effect
```

### Batch Updates

```typescript
import { batch, createSignal, createEffect } from "@wpackages/signal";

const [count, setCount] = createSignal(0);
const [name, setName] = createSignal("John");

createEffect(() => {
  console.log(count(), name());
});

// Effects run only once after batch
batch(() => {
  setCount(1);
  setName("Jane");
});
```

### Watching Changes

```typescript
import { watch, createSignal } from "@wpackages/signal";

const [count, setCount] = createSignal(0);

watch(count, (value, prev) => {
  console.log(`Changed from ${prev} to ${value}`);
});

setCount(1); // Logs: "Changed from 0 to 1"
```

### Watching Multiple Sources

```typescript
import { watchMultiple, createSignal } from "@wpackages/signal";

const [count, setCount] = createSignal(0);
const [name, setName] = createSignal("John");

watchMultiple([count, name], ([count, name], [prevCount, prevName]) => {
  console.log(`Count: ${count}, Name: ${name}`);
});
```

### Async Resources

```typescript
import { createResource, createEffect } from "@wpackages/signal";

const fetchUser = async (id: number) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};

const [user, { loading, error, refetch }] = createResource(() => fetchUser(1));

createEffect(() => {
  if (loading()) {
    console.log("Loading...");
  } else if (error()) {
    console.error("Error:", error());
  } else {
    console.log("User:", user());
  }
});

// Refetch data
refetch();
```

### Selectors

```typescript
import { createSelector, createSignal, createEffect } from "@wpackages/signal";

const [selected, setSelected] = createSignal<number | null>(null);
const isSelected = createSelector(selected);

createEffect(() => {
  console.log("1 selected?", isSelected(1)); // true if selected() === 1
  console.log("2 selected?", isSelected(2)); // true if selected() === 2
});

setSelected(1);
```

### Effect Scopes

```typescript
import { createEffectScope, createEffect, createSignal } from "@wpackages/signal";

const scope = createEffectScope();

scope.run(() => {
  const [count, setCount] = createSignal(0);

  createEffect(() => {
    console.log(count());
  });

  setCount(1); // Logs: 1
});

// Cleanup all effects in scope
scope.dispose();
```

## Advanced Patterns

### Custom Reactive Primitive

```typescript
import { createSignal, createEffect } from "@wpackages/signal";

function createCounter(initial = 0) {
  const [count, setCount] = createSignal(initial);

  return {
    get count() { return count(); },
    increment() { setCount(c => c + 1); },
    decrement() { setCount(c => c - 1); },
    reset() { setCount(initial); }
  };
}

const counter = createCounter(0);
console.log(counter.count); // 0
counter.increment();
console.log(counter.count); // 1
```

### Derived State

```typescript
import { createSignal, createMemo } from "@wpackages/signal";

const [todos, setTodos] = createSignal([
  { id: 1, text: "Learn signals", done: false },
  { id: 2, text: "Build app", done: false }
]);

const completedTodos = createMemo(() => 
  todos().filter(t => t.done)
);

const incompleteTodos = createMemo(() => 
  todos().filter(t => !t.done)
);

const progress = createMemo(() => {
  const total = todos().length;
  const completed = completedTodos().length;
  return total === 0 ? 0 : (completed / total) * 100;
});
```

### Async State Management

```typescript
import { createResource, createSignal } from "@wpackages/signal";

const [userId, setUserId] = createSignal(1);

const [user, { loading, error }] = createResource(
  () => fetchUser(userId()),
  null
);

// User automatically refetches when userId changes
setUserId(2);
```

### Form State

```typescript
import { reactive, watch } from "@wpackages/signal";

const form = reactive({
  username: "",
  email: "",
  password: ""
});

watch(
  () => ({ ...form }),
  (values) => {
    console.log("Form changed:", values);
  },
  { immediate: true }
);
```

### List Management

```typescript
import { createSignal, createSelector } from "@wpackages/signal";

const [items, setItems] = createSignal([
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" }
]);

const [selectedId, setSelectedId] = createSignal<number | null>(null);
const isSelected = createSelector(selectedId);

// Check if item is selected
items().forEach(item => {
  console.log(item.id, isSelected(item.id));
});
```

## Best Practices

### 1. Use createMemo for Derived State

```typescript
// ❌ Bad: Computed in effect
const [count, setCount] = createSignal(0);
const doubled = createSignal(0);

createEffect(() => {
  doubled(count() * 2);
});

// ✅ Good: Use createMemo
const doubled = createMemo(() => count() * 2);
```

### 2. Batch Multiple Updates

```typescript
// ❌ Bad: Multiple effect runs
setCount(1);
setName("Jane");
setEmail("jane@example.com");

// ✅ Good: Batch updates
batch(() => {
  setCount(1);
  setName("Jane");
  setEmail("jane@example.com");
});
```

### 3. Cleanup Side Effects

```typescript
// ❌ Bad: No cleanup
createEffect(() => {
  setInterval(() => {
    console.log("Tick");
  }, 1000);
});

// ✅ Good: Cleanup on dispose
createEffect(() => {
  const interval = setInterval(() => {
    console.log("Tick");
  }, 1000);
  onCleanup(() => clearInterval(interval));
});
```

### 4. Use Effect Scopes for Grouped Effects

```typescript
// ✅ Good: Use scope for cleanup
const scope = createEffectScope();

scope.run(() => {
  // Create multiple effects
  createEffect(() => console.log(count()));
  createEffect(() => console.log(name()));
});

// Cleanup all at once
scope.dispose();
```

### 5. Avoid Circular Dependencies

```typescript
// ❌ Bad: Circular dependency
const [a, setA] = createSignal(0);
const [b, setB] = createSignal(0);

createEffect(() => setB(a() + 1));
createEffect(() => setA(b() + 1)); // Infinite loop!

// ✅ Good: Use derived state
const [a, setA] = createSignal(0);
const b = createMemo(() => a() + 1);
```

## TypeScript Usage

```typescript
import { createSignal, createMemo, reactive } from "@wpackages/signal";

// Typed signals
const [count, setCount] = createSignal<number>(0);
const [name, setName] = createSignal<string>("");

// Complex types
interface User {
  id: number;
  name: string;
  email: string;
}

const [user, setUser] = createSignal<User | null>(null);

// Typed reactive objects
const state = reactive<{
  count: number;
  name: string;
}>({
  count: 0,
  name: "John"
});

// Typed computed
const doubled = createMemo<number>(() => count() * 2);

// Typed resources
const [data, { loading }] = createResource<User>(
  () => fetchUser(1)
);
```
