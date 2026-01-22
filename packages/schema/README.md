# @wpackages/schema

## Introduction

@wpackages/schema is a high-performance schema validation library designed to provide better performance and developer experience than popular alternatives like Zod and Effect Schema. Built with a custom implementation focused on speed, type safety, and ease of use, this library offers comprehensive validation capabilities for TypeScript projects with zero runtime dependencies.

The library provides a fluent API for defining schemas, validating data, and transforming values with full TypeScript type inference. Whether you're validating API responses, form inputs, or configuration files, @wpackages/schema gives you the tools to ensure data integrity with minimal overhead.

## Features

- ⚡ **High Performance** - Custom implementation optimized for speed with minimal memory allocation
- 🔒 **Type Safety** - Full TypeScript type inference for validated data
- 🎯 **Fluent API** - Intuitive chainable methods for building complex schemas
- 🛡️ **Comprehensive Validation** - Primitive types, composite types, and custom refinements
- 🔄 **Data Transformation** - Transform validated data on the fly with the `transform` method
- 📝 **Detailed Errors** - Clear, actionable error messages with path information
- 🎨 **Composable** - Build complex schemas from simple, reusable parts
- 🌐 **Zero Runtime Dependencies** - Lightweight footprint for production builds
- 🧪 **Well Tested** - Comprehensive test coverage for reliability

## Goal

- 🚀 Provide the fastest schema validation library in the TypeScript ecosystem
- 📚 Offer an API that is both powerful and easy to learn
- 🎯 Maintain 100% type safety with excellent IDE autocomplete
- 💡 Enable developers to catch bugs at compile time rather than runtime
- 🔄 Support complex validation scenarios with composable schemas
- 📦 Keep the library lightweight with minimal bundle size
- 🌍 Provide excellent documentation and examples for all use cases

## Design Principles

- 🎯 **Performance First** - Every optimization contributes to faster validation
- 🔒 **Type Safety** - Leverage TypeScript's type system to prevent errors
- 🧩 **Composability** - Build complex schemas from simple, reusable parts
- 📖 **Clarity** - Clear error messages and intuitive API design
- 🎨 **Immutability** - Schemas are immutable, preventing unintended side effects
- 🔄 **Flexibility** - Support for optional, nullable, and transformed values
- 🧪 **Testability** - Easy to test schemas in isolation
- 📦 **Zero Dependencies** - No external runtime dependencies for maximum portability

## Installation

### Install via Bun

```bash
bun add @wpackages/schema
```

### Install via npm

```bash
npm install @wpackages/schema
```

### Install via yarn

```bash
yarn add @wpackages/schema
```

### Install via pnpm

```bash
pnpm add @wpackages/schema
```

## Usage

### Basic Validation

```typescript
import { string, number, object } from "@wpackages/schema";

const userSchema = object({
  name: string(),
  age: number(),
});

const result = userSchema.parse({ name: "John", age: 30 });
if (result.success) {
  console.log(result.data); // { name: "John", age: 30 }
} else {
  console.error(result.error);
}
```

### Optional and Nullable Fields

```typescript
import { string, object } from "@wpackages/schema";

const schema = object({
  name: string(),
  nickname: string().optional(),
  bio: string().nullable(),
});
```

### Transforming Values

```typescript
import { string, transform } from "@wpackages/schema";

const emailSchema = string()
  .transform((value) => value.toLowerCase());
```

### Custom Refinements

```typescript
import { string } from "@wpackages/schema";

const passwordSchema = string()
  .refine((value) => value.length >= 8)
  .withMessage("Password must be at least 8 characters");
```

### Union Types

```typescript
import { string, number, union } from "@wpackages/schema";

const schema = union([string(), number()]);
```

### Array Validation

```typescript
import { string, array } from "@wpackages/schema";

const schema = array(string());
```

## Examples

### API Response Validation

```typescript
import { object, string, number, array, boolean } from "@wpackages/schema";

const userResponseSchema = object({
  id: number(),
  name: string(),
  email: string(),
  age: number(),
  isActive: boolean(),
  roles: array(string()),
});

async function fetchUser(id: number) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  
  const result = userResponseSchema.parse(data);
  
  if (!result.success) {
    throw new Error("Invalid user data");
  }
  
  return result.data;
}
```

### Form Validation

```typescript
import { string, number, object, email, minLength } from "@wpackages/schema";

const formSchema = object({
  username: string()
    .refine((value) => /^[a-zA-Z0-9_]+$/.test(value))
    .withMessage("Username can only contain letters, numbers, and underscores"),
  email: string()
    .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    .withMessage("Invalid email format"),
  age: number()
    .refine((value) => value >= 18)
    .withMessage("Must be at least 18 years old"),
});

function validateForm(formData: unknown) {
  const result = formSchema.parse(formData);
  
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.issues || [],
    };
  }
  
  return {
    valid: true,
    data: result.data,
  };
}
```

### Configuration Schema

```typescript
import { object, string, number, boolean, union, literal } from "@wpackages/schema";

const configSchema = object({
  environment: union([
    literal("development"),
    literal("staging"),
    literal("production"),
  ]),
  port: number(),
  host: string(),
  debug: boolean().optional(),
  timeout: number().optional(),
});

function loadConfig(config: unknown) {
  const result = configSchema.parse(config);
  
  if (!result.success) {
    throw new Error("Invalid configuration");
  }
  
  return result.data;
}
```

### Nested Objects

```typescript
import { object, string, number, array } from "@wpackages/schema";

const addressSchema = object({
  street: string(),
  city: string(),
  country: string(),
  zipCode: string(),
});

const personSchema = object({
  name: string(),
  age: number(),
  addresses: array(addressSchema),
});

const person = {
  name: "John Doe",
  age: 30,
  addresses: [
    {
      street: "123 Main St",
      city: "New York",
      country: "USA",
      zipCode: "10001",
    },
  ],
};

const result = personSchema.parse(person);
```

## License

MIT License

Copyright (c) 2026 wpackages

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
