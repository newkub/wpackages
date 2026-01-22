# @wpackages/validator

Comprehensive validation library for TypeScript with type-safe validators.

## Features

- **Type-safe validators** with full TypeScript support
- **Comprehensive validators** for strings, numbers, arrays, dates, objects, and custom types
- **Composable validators** that can be chained together
- **Standalone usage** - works without schema libraries
- **Zero dependencies** (except TypeScript)

## Installation

```bash
bun add @wpackages/validator
```

## Usage

### String Validators

```typescript
import { email, url, uuid, minLength, maxLength, pattern } from "@wpackages/validator";

// Email validation
const result = email("test@example.com");
if (result.success) {
  console.log(result.data); // "test@example.com"
} else {
  console.error(result.error.message);
}

// URL validation
const urlResult = url("https://example.com");

// UUID validation
const uuidResult = uuid("123e4567-e89b-12d3-a456-426614174000");

// Length validation
const minResult = minLength(5)("hello");
const maxResult = maxLength(10)("hello world");

// Pattern validation
const patternResult = pattern(/^[a-z]+$/)("hello");
```

### Number Validators

```typescript
import { min, max, positive, negative, integer, range } from "@wpackages/validator";

// Range validation
const minResult = min(0)(5);
const maxResult = max(100)(50);

// Sign validation
const positiveResult = positive(5);
const negativeResult = negative(-5);

// Type validation
const integerResult = integer(5);

// Range validation
const rangeResult = range(0, 100)(50);
```

### Array Validators

```typescript
import { arrayNonEmpty, minItems, maxItems, exactItems, unique } from "@wpackages/validator";

// Non-empty array
const nonEmptyResult = arrayNonEmpty([1, 2, 3]);

// Length validation
const minItemsResult = minItems(2)([1, 2, 3]);
const maxItemsResult = maxItems(5)([1, 2, 3, 4, 5]);
const exactItemsResult = exactItems(3)([1, 2, 3]);

// Unique items
const uniqueResult = unique([1, 2, 3]);
```

### Date Validators

```typescript
import { minDate, maxDate, past, future, today } from "@wpackages/validator";

// Date range validation
const minDateResult = minDate(new Date("2024-01-01"))(new Date("2024-06-01"));
const maxDateResult = maxDate(new Date("2024-12-31"))(new Date("2024-06-01"));

// Time validation
const pastResult = past(new Date("2023-01-01"));
const futureResult = future(new Date("2025-01-01"));
const todayResult = today(new Date());
```

### Object Validators

```typescript
import { hasKey, requiredKeys, shape, exactShape } from "@wpackages/validator";

// Key validation
const hasKeyResult = hasKey("name")({ name: "John" });
const requiredKeysResult = requiredKeys("name", "age")({ name: "John", age: 30 });

// Shape validation
const shapeResult = shape({
  name: (value) => typeof value === "string" ? { success: true, data: value } : { success: false, error: { path: [], message: "Invalid name", code: "invalid" } },
  age: (value) => typeof value === "number" ? { success: true, data: value } : { success: false, error: { path: [], message: "Invalid age", code: "invalid" } },
})({ name: "John", age: 30 });
```

### Custom Validators

```typescript
import { custom, oneOf, notOneOf, matches, required, optional, nullable } from "@wpackages/validator";

// Custom validation
const customResult = custom((value) => typeof value === "string" && value.length > 0)("hello");

// Enum validation
const oneOfResult = oneOf(["a", "b", "c"] as const)("b");
const notOneOfResult = notOneOf(["a", "b", "c"] as const)("d");

// Exact match
const matchesResult = matches("hello")("hello");

// Required validation
const requiredResult = required("hello");

// Optional validation
const optionalResult = optional((value) => typeof value === "string" ? { success: true, data: value } : { success: false, error: { path: [], message: "Invalid", code: "invalid" } })(undefined);

// Nullable validation
const nullableResult = nullable((value) => typeof value === "string" ? { success: true, data: value } : { success: false, error: { path: [], message: "Invalid", code: "invalid" } })(null);
```

## API Reference

### ValidationResult

```typescript
type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; error: ValidationError };
```

### ValidationError

```typescript
interface ValidationError {
  path: readonly string[];
  message: string;
  code: string;
}
```

### Error Codes

- `invalid_type` - Value has wrong type
- `invalid_email` - Invalid email format
- `invalid_url` - Invalid URL format
- `invalid_uuid` - Invalid UUID format
- `invalid_length` - Value length is invalid
- `invalid_range` - Value is out of range
- `invalid_pattern` - Value does not match pattern
- `invalid_date` - Invalid date
- `invalid_enum` - Value is not in enum
- `required` - Value is required
- `custom` - Custom validation failed

## License

MIT
