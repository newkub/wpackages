# @wpackages/utils-kit

## Introduction

`@wpackages/utils-kit` is a comprehensive meta-package that provides a unified interface for essential utility libraries. It aggregates and re-exports all utility-related packages from the wpackages monorepo, offering developers a single entry point to access powerful tools for error handling, schema validation, reactive signals, state management, and diff utilities. Built with functional programming principles and type-safety at its core, this kit ensures robust and maintainable code across any TypeScript project.

## Features

- 🎯 **Error Handling**: Comprehensive error management utilities with type-safe error creation and handling
- ✅ **Schema Validation**: Powerful schema validation system for runtime type checking and data transformation
- ⚡ **Reactive Signals**: Lightweight reactive programming primitives for building reactive applications
- 📦 **State Management**: Flexible store implementation for managing application state
- 🔍 **Diff Utilities**: Efficient diff algorithms for comparing and tracking changes in data structures
- 🔒 **Type-Safe**: Leverages TypeScript's type system for compile-time safety
- 🧩 **Functional Programming**: All utilities follow functional programming patterns
- 🎨 **Composable**: Utilities are designed to work together seamlessly
- 📏 **Consistent API**: Uniform patterns across all utility libraries

## Goal

- 🎯 **Unified Utilities**: Provide a single, consistent API for all common utility needs
- 🛡️ **Robustness**: Eliminate runtime errors through type-safe utilities and validation
- 🤸 **Flexibility**: Enable developers to handle any data manipulation scenario
- 🧑‍💻 **Superior DX**: Make data manipulation and validation as intuitive as possible
- ✅ **Reliability**: Ensure all utilities are thoroughly tested and production-ready

## Design Principles

- 🏛️ **Functional First**: All utilities follow functional programming principles
- 🧩 **Composability**: Utilities are designed to be composable and reusable
- 📏 **Consistency**: Maintain uniform patterns and conventions across all utilities
- 🔒 **Type Safety**: Leverage TypeScript's type system to catch errors at compile time
- ⚡ **Performance**: Optimize for performance while maintaining readability
- 🎨 **User-Friendly**: APIs should be intuitive and easy to use

## Installation

This is a workspace package. Ensure you have installed dependencies from the monorepo root:

```bash
bun install
```

## Usage

### Error Handling

Create and handle errors with type safety:

```typescript
import { Error, isError } from "@wpackages/utils-kit";

const createAppError = (message: string, code: number) => {
	return Error.create({
		message,
		code,
	});
};

const error = createAppError("Something went wrong", 500);

if (isError(error)) {
	console.error(error.message);
	console.error(`Error code: ${error.code}`);
}
```

### Schema Validation

Validate and transform data with schemas:

```typescript
import { Schema, validate } from "@wpackages/utils-kit";

const userSchema = Schema.struct({
	name: Schema.string,
	age: Schema.number,
	email: Schema.string.optional,
});

const result = validate(userSchema, {
	name: "Alice",
	age: 25,
});

if (result._tag === "Success") {
	console.log("Valid user:", result.value);
} else {
	console.error("Validation errors:", result.errors);
}
```

### Reactive Signals

Create reactive signals for state management:

```typescript
import { Signal, effect } from "@wpackages/utils-kit";

const count = Signal.create(0);

// Create reactive effect
effect(() => {
	console.log("Count changed:", count.value);
});

// Update signal
count.value = 1; // Logs: Count changed: 1
count.value = 2; // Logs: Count changed: 2

// Derived signals
const doubled = Signal.derived(count, (value) => value * 2);
console.log(doubled.value); // 4
```

### State Management

Manage application state with stores:

```typescript
import { Store } from "@wpackages/utils-kit";

interface AppState {
	user: { name: string; email: string } | null;
	count: number;
}

const store = Store.create<AppState>({
	user: null,
	count: 0,
});

// Subscribe to changes
store.subscribe((state) => {
	console.log("State updated:", state);
});

// Update state
store.set({
	user: { name: "Alice", email: "alice@example.com" },
	count: 1,
});

// Partial updates
store.patch({ count: 2 });
```

### Diff Utilities

Compare and track changes in data:

```typescript
import { Diff } from "@wpackages/utils-kit";

const oldData = {
	users: [
		{ id: 1, name: "Alice", active: true },
		{ id: 2, name: "Bob", active: false },
	],
	settings: { theme: "dark" },
};

const newData = {
	users: [
		{ id: 1, name: "Alice", active: false },
		{ id: 2, name: "Bob", active: true },
		{ id: 3, name: "Charlie", active: true },
	],
	settings: { theme: "light" },
};

const changes = Diff.diff(oldData, newData);

console.log(changes);
// {
//   users: {
//     added: [{ id: 3, name: "Charlie", active: true }],
//     removed: [],
//     modified: [
//       { id: 1, changes: { active: { from: true, to: false } } },
//       { id: 2, changes: { active: { from: false, to: true } } }
//     ]
//   },
//   settings: {
//     theme: { from: "dark", to: "light" }
//   }
// }
```

## Examples

### Form Validation with Schema

```typescript
import { Schema, validate } from "@wpackages/utils-kit";

const formSchema = Schema.struct({
	username: Schema.string.pipe(
		Schema.minLength(3),
		Schema.maxLength(20),
	),
	email: Schema.string.pipe(Schema.email),
	password: Schema.string.pipe(Schema.minLength(8)),
	age: Schema.number.pipe(Schema.min(18), Schema.max(120)),
});

function handleFormSubmit(formData: unknown) {
	const result = validate(formSchema, formData);

	if (result._tag === "Success") {
		console.log("Form is valid:", result.value);
		// Submit form
	} else {
		console.error("Validation errors:", result.errors);
		// Show errors to user
	}
}

handleFormSubmit({
	username: "alice",
	email: "alice@example.com",
	password: "securepass123",
	age: 25,
});
```

### Reactive Component with Signals

```typescript
import { Signal, effect, computed } from "@wpackages/utils-kit";

class Counter {
	private count = Signal.create(0);
	private doubled = computed(this.count, (value) => value * 2);

	constructor() {
		// Log whenever count changes
		effect(() => {
			console.log(`Count: ${this.count.value}, Doubled: ${this.doubled.value}`);
		});
	}

	increment() {
		this.count.value++;
	}

	decrement() {
		this.count.value--;
	}

	getCount() {
		return this.count.value;
	}

	getDoubled() {
		return this.doubled.value;
	}
}

const counter = new Counter();
counter.increment(); // Logs: Count: 1, Doubled: 2
counter.increment(); // Logs: Count: 2, Doubled: 4
```

### State Management with Store

```typescript
import { Store } from "@wpackages/utils-kit";

interface TodoState {
	todos: Array<{ id: number; text: string; completed: boolean }>;
	filter: "all" | "active" | "completed";
}

const todoStore = Store.create<TodoState>({
	todos: [],
	filter: "all",
});

// Actions
const addTodo = (text: string) => {
	todoStore.patch({
		todos: [
			...todoStore.get().todos,
			{ id: Date.now(), text, completed: false },
		],
	});
};

const toggleTodo = (id: number) => {
	const todos = todoStore.get().todos.map((todo) =>
		todo.id === id ? { ...todo, completed: !todo.completed } : todo,
	);
	todoStore.patch({ todos });
};

const setFilter = (filter: TodoState["filter"]) => {
	todoStore.patch({ filter });
};

// Subscribe to changes
todoStore.subscribe((state) => {
	console.log("State changed:", state);
});

// Usage
addTodo("Buy groceries");
addTodo("Walk the dog");
toggleTodo(1);
setFilter("active");
```

### Error Handling with Custom Errors

```typescript
import { Error, isError, catchError } from "@wpackages/utils-kit";

class ValidationError extends Error.Tag("ValidationError")<{
	field: string;
	message: string;
}> {}

class NetworkError extends Error.Tag("NetworkError")<{
	url: string;
	status: number;
}> {}

async function fetchUserData(userId: string) {
	try {
		const response = await fetch(`/api/users/${userId}`);

		if (!response.ok) {
			throw NetworkError.create({
				url: `/api/users/${userId}`,
				status: response.status,
			});
		}

		return await response.json();
	} catch (error) {
		if (isError(error)) {
			if (error._tag === "NetworkError") {
				console.error(`Network error: ${error.url} returned ${error.status}`);
			}
		}
		throw error;
	}
}

// Using catchError
const result = await catchError(
	fetchUserData("123"),
	(error) => {
		if (isError(error)) {
			console.error("Failed to fetch user:", error);
		}
		return { id: 0, name: "Unknown" };
	},
);
```

## License

MIT
