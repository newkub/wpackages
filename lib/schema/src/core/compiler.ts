/**
 * Schema Compiler
 * Compiles schemas into optimized validation functions for better runtime performance.
 */

import type { Schema, Result } from "../types";

type CompiledValidator<T> = (input: unknown) => Result<T>;

const compilerCache = new WeakMap<Schema<unknown, unknown>, CompiledValidator<unknown>>();

export function compile<T>(schema: Schema<unknown, T>): CompiledValidator<T> {
	const cached = compilerCache.get(schema);
	if (cached) {
		return cached as CompiledValidator<T>;
	}

	const validator = createCompiledValidator(schema);
	compilerCache.set(schema, validator);
	return validator;
}

function createCompiledValidator<T>(schema: Schema<unknown, T>): CompiledValidator<T> {
	const metadata = schema._metadata;
	const schemaName = metadata?.name || "unknown";

	switch (schemaName) {
		case "string":
			return compileStringSchema(schema as any);
		case "number":
			return compileNumberSchema(schema as any);
		case "boolean":
			return compileBooleanSchema(schema as any);
		case "object":
			return compileObjectSchema(schema as any);
		case "array":
			return compileArraySchema(schema as any);
		case "literal":
			return compileLiteralSchema(schema as any);
		case "union":
			return compileUnionSchema(schema as any);
		case "intersection":
			return compileIntersectionSchema(schema as any);
		default:
			return schema.parse.bind(schema);
	}
}

function compileStringSchema(schema: any): CompiledValidator<string> {
	const options = schema as { min?: number; max?: number; pattern?: RegExp; message?: string };

	return (input: unknown): Result<string> => {
		if (typeof input !== "string") {
			return {
				success: false,
				issues: [{ message: options.message || `Expected a string, but received ${typeof input}`, path: [] }],
			};
		}

		if (options.min !== undefined && input.length < options.min) {
			return {
				success: false,
				issues: [{ message: `String must contain at least ${options.min} character(s)`, path: [] }],
			};
		}

		if (options.max !== undefined && input.length > options.max) {
			return {
				success: false,
				issues: [{ message: `String must contain at most ${options.max} character(s)`, path: [] }],
			};
		}

		if (options.pattern && !options.pattern.test(input)) {
			return {
				success: false,
				issues: [{ message: `String must match pattern ${options.pattern}`, path: [] }],
			};
		}

		return { success: true, data: input };
	};
}

function compileNumberSchema(schema: any): CompiledValidator<number> {
	const options = schema as { min?: number; max?: number; integer?: boolean; message?: string };

	return (input: unknown): Result<number> => {
		if (typeof input !== "number" || Number.isNaN(input)) {
			return {
				success: false,
				issues: [{ message: options.message || `Expected a number, but received ${typeof input}`, path: [] }],
			};
		}

		if (options.integer && !Number.isInteger(input)) {
			return {
				success: false,
				issues: [{ message: "Expected an integer", path: [] }],
			};
		}

		if (options.min !== undefined && input < options.min) {
			return {
				success: false,
				issues: [{ message: `Number must be at least ${options.min}`, path: [] }],
			};
		}

		if (options.max !== undefined && input > options.max) {
			return {
				success: false,
				issues: [{ message: `Number must be at most ${options.max}`, path: [] }],
			};
		}

		return { success: true, data: input };
	};
}

function compileBooleanSchema(_schema: any): CompiledValidator<boolean> {
	return (input: unknown): Result<boolean> => {
		if (typeof input !== "boolean") {
			return {
				success: false,
				issues: [{ message: `Expected a boolean, but received ${typeof input}`, path: [] }],
			};
		}
		return { success: true, data: input };
	};
}

function compileLiteralSchema(schema: any): CompiledValidator<unknown> {
	const literalValue = schema._output;

	return (input: unknown): Result<unknown> => {
		if (input !== literalValue) {
			return {
				success: false,
				issues: [{ message: `Expected literal ${JSON.stringify(literalValue)}, but received ${JSON.stringify(input)}`, path: [] }],
			};
		}
		return { success: true, data: literalValue };
	};
}

function compileObjectSchema(schema: any): CompiledValidator<Record<string, unknown>> {
	const shape = schema.shape || {};
	const unknownKeysPolicy = schema.unknownKeys || "strip";
	const keys = Object.keys(shape);
	const validators = keys.map((key) => ({
		key,
		validator: compile(shape[key]),
	}));

	return (input: unknown): Result<Record<string, unknown>> => {
		if (typeof input !== "object" || input === null) {
			return {
				success: false,
				issues: [{ message: `Expected an object, but received ${typeof input}`, path: [] }],
			};
		}

		const issues: any[] = [];
		const output: Record<string, unknown> = {};
		const record = input as Record<string, unknown>;

		if (unknownKeysPolicy !== "strip") {
			for (const key in record) {
				if (Object.hasOwn(record, key) && !Object.hasOwn(shape, key)) {
					if (unknownKeysPolicy === "strict") {
						issues.push({ message: `Unknown key: ${key}`, path: [key] });
					} else {
						output[key] = record[key];
					}
				}
			}
		}

		for (const { key, validator } of validators) {
			const value = record[key];
			const result = validator(value);

			if (result.success) {
				output[key] = result.data;
			} else {
				issues.push(...result.issues.map((issue) => ({ ...issue, path: [key, ...issue.path] })));
			}
		}

		if (issues.length > 0) {
			return { success: false, issues };
		}

		return { success: true, data: output };
	};
}

function compileArraySchema(schema: any): CompiledValidator<unknown[]> {
	const itemValidator = compile(schema.item);

	return (input: unknown): Result<unknown[]> => {
		if (!Array.isArray(input)) {
			return {
				success: false,
				issues: [{ message: `Expected an array, but received ${typeof input}`, path: [] }],
			};
		}

		const issues: any[] = [];
		const output: unknown[] = [];

		for (let i = 0; i < input.length; i++) {
			const result = itemValidator(input[i]);
			if (result.success) {
				output.push(result.data);
			} else {
				issues.push(...result.issues.map((issue) => ({ ...issue, path: [i, ...issue.path] })));
			}
		}

		if (issues.length > 0) {
			return { success: false, issues };
		}

		return { success: true, data: output };
	};
}

function compileUnionSchema(schema: any): CompiledValidator<unknown> {
	const schemas = schema.schemas || [];
	const validators = schemas.map(compile);

	return (input: unknown): Result<unknown> => {
		const issues: any[] = [];

		for (const validator of validators) {
			const result = validator(input);
			if (result.success) {
				return result;
			}
			issues.push(...result.issues);
		}

		return {
			success: false,
			issues: [{ message: "No union member matched", path: [], unionIssues: issues }],
		};
	};
}

function compileIntersectionSchema(schema: any): CompiledValidator<unknown> {
	const schemas = schema.schemas || [];
	const validators = schemas.map(compile);

	return (input: unknown): Result<unknown> => {
		let output = input;
		const allIssues: any[] = [];

		for (const validator of validators) {
			const result = validator(output);
			if (result.success) {
				output = { ...output, ...(result.data as object) };
			} else {
				allIssues.push(...result.issues);
			}
		}

		if (allIssues.length > 0) {
			return { success: false, issues: allIssues };
		}

		return { success: true, data: output };
	};
}

export function clearCompilerCache(): void {
	compilerCache.clear();
}

export function getCompilerCacheSize(): number {
	return compilerCache.size;
}
