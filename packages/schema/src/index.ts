/**
 * @wpackages/schema - High-performance schema validation library
 * Better than Zod and Effect Schema with custom implementation
 */

// Core types
export type * from "./types/core.js";

// Core schema
export { BaseSchema, createSchema } from "./core/schema.js";

// Primitive schemas
export { any, boolean, date, literal, never, number, string, unknown } from "./schemas/primitives.js";

// Composite schemas
export {
	array,
	discriminatedUnion,
	discriminatedUnionMap,
	enum_,
	intersection,
	object,
	record,
	tuple,
	union,
} from "./schemas/composite.js";

// Validation utilities
export {
	email,
	integer,
	max,
	maxDate,
	maxItems,
	maxLength,
	min,
	minDate,
	minItems,
	minLength,
	negative,
	nonEmpty,
	pattern,
	positive,
	url,
	uuid,
} from "./utils/validation.js";

// Error handling
export { formatError, mergeErrors, SchemaValidationError } from "./error/validation-error.js";

// Re-export Schema type for convenience
export type { Schema } from "./types/core.js";
