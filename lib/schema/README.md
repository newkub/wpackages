# @wpackages/schema

## Introduction

`@wpackages/schema` is a central library for defining, validating, and using data schemas across the entire `wpackages` monorepo. It is a type-safe schema validation library with full type inference and a functional API. This package serves as the single source of truth for the shape of data as it moves between different services and applications.

## Features

### Core Features
- ✅ **Single Source of Truth**: Provides a centralized location for all shared data models and types.
- 🔒 **Type-Safe by Default**: Derives static TypeScript types directly from your schemas, eliminating inconsistencies.
- 🏃 **Runtime Validation**: Schemas can be used to parse and validate unknown data at runtime, ensuring data integrity.
- 🧩 **Composable**: Complex schemas can be built by composing simpler ones.

### Advanced Features
- ⚡ **Async Validation**: Support for asynchronous validation with `parseAsync` and `asyncRefine`.
- 🔄 **Recursive Schemas**: Define self-referencing schemas using `lazy()` for tree-like data structures.
- 🎯 **Lazy Evaluation**: Defer schema creation until first use for performance optimization.
- 🔗 **Union Types**: Combine multiple schemas with `union()` to accept any of several types.
- ⚖️ **Intersection Types**: Merge multiple object schemas with `intersection()`.
- 🔀 **Conditional Schemas**: Select schemas dynamically based on input values.
- 🔬 **Schema Refinement**: Add custom validation rules with `refine()`.
- 🔄 **Schema Transformation**: Transform validated data with `transform()`.
- 📝 **Partial/Required**: Make all fields optional or required with `partial()` and `required()`.
- ✂️ **Pick/Omit**: Select or exclude specific fields with `pick()` and `omit()`.
- 🔄 **Schema Merge**: Combine multiple schemas into one with `merge()`.
- 📊 **Metadata Support**: Add descriptions, examples, and custom metadata to schemas.
- 🎯 **Default Values**: Define default values for fields with `default()`.

## Goal

- 🎯 **Data Consistency**: To ensure that all parts of the system agree on the shape of the data they exchange.
- 🛡️ **Prevent Data-Related Bugs**: To catch data-related errors at compile time (via TypeScript) and at runtime (via validation).
- 🧑‍💻 **Improve Developer Experience**: To provide clear, reusable, and self-documenting definitions for all core data structures.

## Design Principles

- **Schema-First**: The schema is the primary definition of a data structure; the TypeScript type is derived from it.
- **Immutability**: Schemas and the data they produce are treated as immutable.
- **Explicitness**: All data validation and transformation rules are explicitly defined in the schema.
- **Functional API**: Chainable methods for composing and transforming schemas.

## Installation

This is a workspace package. Ensure you have installed dependencies from the monorepo root:

```bash
bun install
```

## Usage

### Basic Schemas

```typescript
import { string, number, boolean, object, array } from "@wpackages/schema";

// Define basic schemas
const nameSchema = string({ min: 2, max: 50 });
const ageSchema = number({ min: 0, max: 150 });
const isActiveSchema = boolean();

// Define an object schema
const userSchema = object({
	shape: {
		name: nameSchema,
		age: ageSchema,
		isActive: isActiveSchema.optional(),
	},
});

// Parse and validate data
const result = userSchema.parse({
	name: "John Doe",
	age: 30,
	isActive: true,
});

if (result.success) {
	console.log(result.data); // { name: "John Doe", age: 30, isActive: true }
} else {
	console.error(result.issues);
}
```

### Schema Refinement

```typescript
import { string } from "@wpackages/schema";

const emailSchema = string().refine((value) => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
		? true
		: "Invalid email address";
});

const result = emailSchema.parse("test@example.com");
```

### Schema Transformation

```typescript
import { string } from "@wpackages/schema";

const trimmedStringSchema = string().transform((value) => value.trim());

const result = trimmedStringSchema.parse("  hello  ");
// result.data = "hello"
```

### Default Values

```typescript
import { string } from "@wpackages/schema";

const nameSchema = string().default("Anonymous");

const result = nameSchema.parse(undefined);
// result.data = "Anonymous"
```

### Async Validation

```typescript
import { string, asyncRefine } from "@wpackages/schema";

const uniqueEmailSchema = asyncRefine(string(), async (email) => {
	const exists = await checkEmailInDatabase(email);
	return !exists ? true : "Email already exists";
});

const result = await uniqueEmailSchema.parseAsync!("test@example.com");
```

### Recursive Schemas

```typescript
import { number, object } from "@wpackages/schema";
import { lazy } from "@wpackages/schema";

let nodeSchema: any;
nodeSchema = lazy(() =>
	object({
		shape: {
			value: number(),
			left: nodeSchema.optional(),
			right: nodeSchema.optional(),
		},
	}),
);

const result = nodeSchema.parse({
	value: 1,
	left: { value: 2 },
	right: { value: 3, left: { value: 4 } },
});
```

### Union Types

```typescript
import { string, number, union } from "@wpackages/schema";

const stringOrNumberSchema = union([string(), number()]);

const result1 = stringOrNumberSchema.parse("hello"); // success
const result2 = stringOrNumberSchema.parse(42); // success
const result3 = stringOrNumberSchema.parse(true); // failure
```

### Partial/Required

```typescript
import { string, number, partial, required } from "@wpackages/schema";

const partialSchema = partial({
	shape: {
		name: string(),
		age: number(),
	},
});

const result = partialSchema.parse({ name: "John" }); // success - age is optional

const requiredSchema = required({
	shape: {
		name: string(),
		age: number(),
	},
});

const result2 = requiredSchema.parse({ name: "John" }); // failure - age is required
```

### Pick/Omit

```typescript
import { string, number, pick, omit } from "@wpackages/schema";

const userSchema = {
	shape: {
		name: string(),
		age: number(),
		password: string(),
	},
};

const publicUserSchema = pick({
	shape: userSchema.shape,
	keys: ["name", "age"],
});

const safeUserSchema = omit({
	shape: userSchema.shape,
	keys: ["password"],
});
```

### Schema Metadata

```typescript
import { string } from "@wpackages/schema";

const nameSchema = string()
	.description("The user's full name")
	.examples("John Doe", "Jane Smith")
	.metadata({ format: "full-name" });

console.log(nameSchema._metadata.description); // "The user's full name"
console.log(nameSchema._metadata.examples); // ["John Doe", "Jane Smith"]
```

## API Reference

### Schema Types
- `string(options?)` - String schema with optional min/max/pattern constraints
- `number(options?)` - Number schema with optional min/max constraints
- `boolean()` - Boolean schema
- `literal(value)` - Literal value schema
- `array(schema, options?)` - Array schema
- `object(options)` - Object schema with shape definition

### Schema Composition
- `union(schemas, message?)` - Union of multiple schemas
- `intersection(schemas, message?)` - Intersection of object schemas
- `conditional(options)` - Conditional schema selection

### Schema Utilities
- `partial(options)` - Make all fields optional
- `required(options)` - Make all fields required
- `pick(options)` - Select specific fields
- `omit(options)` - Exclude specific fields
- `merge(options)` - Merge multiple schemas
- `lazy(getter)` - Lazy/recursive schema

### Schema Methods
- `.optional()` - Make schema optional
- `.transform(fn)` - Transform validated data
- `.refine(fn)` - Add custom validation
- `.default(value)` - Set default value
- `.description(text)` - Add description
- `.examples(...values)` - Add examples
- `.metadata(data)` - Add custom metadata

### Async Validation
- `withAsync(schema)` - Add async support to schema
- `asyncRefine(schema, fn)` - Add async refinement
- `.parseAsync(input)` - Parse asynchronously

## License

This project is licensed under the MIT License.
