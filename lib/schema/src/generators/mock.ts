/**
 * Mock Data Generator
 * Generates mock data from schemas for testing purposes.
 */

import type { Schema } from "../types";
import { stringGenerator } from "./types/string";
import { numberGenerator } from "./types/number";
import { booleanGenerator } from "./types/boolean";
import { literalGenerator } from "./types/literal";
import { objectGenerator } from "./types/object";
import { arrayGenerator } from "./types/array";
import { unionGenerator } from "./types/union";
import { intersectionGenerator } from "./types/intersection";

export type MockStrategy = "random" | "realistic" | "edge-cases";

export interface MockOptions {
	strategy?: MockStrategy;
	seed?: number;
	depth?: number;
}

const DEFAULT_OPTIONS: Required<MockOptions> = {
	strategy: "random",
	seed: Date.now(),
	depth: 3,
};

let currentSeed = DEFAULT_OPTIONS.seed;

export function seededRandom(): number {
	currentSeed = (currentSeed * 9301 + 49297) % 233280;
	return currentSeed / 233280;
}

function resetSeed(seed: number): void {
	currentSeed = seed;
}

export function mock<T>(schema: Schema<unknown, T>, options: MockOptions = {}): T {
	const opts = { ...DEFAULT_OPTIONS, ...options };
	resetSeed(opts.seed);

	return generateMock(schema, opts);
}

export function generateMock<T>(schema: Schema<unknown, T>, options: Required<MockOptions>, depth = 0): T {
	if (depth > options.depth) {
		throw new Error("Maximum recursion depth exceeded");
	}

	const metadata = schema._metadata;
	const schemaName = metadata?.name || "unknown";

	switch (schemaName) {
		case "string":
			return stringGenerator(schema as any, options) as T;
		case "number":
			return numberGenerator(schema as any, options) as T;
		case "boolean":
			return booleanGenerator(schema as any, options) as T;
		case "literal":
			return literalGenerator(schema as any, options) as T;
		case "object":
			return objectGenerator(schema as any, options, depth) as T;
		case "array":
			return arrayGenerator(schema as any, options, depth) as T;
		case "union":
			return unionGenerator(schema as any, options, depth) as T;
		case "intersection":
			return intersectionGenerator(schema as any, options, depth) as T;
		default:
			return generateDefaultMock(schema, options, depth) as T;
	}
}

function generateDefaultMock<T>(schema: Schema<unknown, T>, options: Required<MockOptions>, _depth: number): T {
	if (schema._output !== undefined) {
		return schema._output as T;
	}

	const result = schema.parse(generateFallbackValue(options));
	if (result.success) {
		return result.data;
	}

	throw new Error(`Cannot generate mock for schema: ${schema._metadata?.name || "unknown"}`);
}

function generateFallbackValue(options: Required<MockOptions>): unknown {
	const rand = seededRandom();

	if (rand < 0.25) {
		return generateRandomString(options);
	} else if (rand < 0.5) {
		return generateRandomNumber(options);
	} else if (rand < 0.75) {
		return generateRandomBoolean(options);
	} else {
		return generateRandomArray(options);
	}
}

function generateRandomString(_options: Required<MockOptions>): string {
	const length = Math.floor(seededRandom() * 20) + 1;
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(seededRandom() * chars.length));
	}
	return result;
}

function generateRandomNumber(_options: Required<MockOptions>): number {
	return Math.floor(seededRandom() * 1000);
}

function generateRandomBoolean(_options: Required<MockOptions>): boolean {
	return seededRandom() < 0.5;
}

function generateRandomArray(_options: Required<MockOptions>): unknown[] {
	const length = Math.floor(seededRandom() * 5) + 1;
	return Array.from({ length }, () => generateFallbackValue(DEFAULT_OPTIONS));
}

export function mockMany<T>(schema: Schema<unknown, T>, count: number, options: MockOptions = {}): T[] {
	const results: T[] = [];
	for (let i = 0; i < count; i++) {
		results.push(mock(schema, { ...options, seed: (options.seed || Date.now()) + i }));
	}
	return results;
}

export function mockEdgeCases<T>(schema: Schema<unknown, T>): T[] {
	const edgeCases: T[] = [];

	edgeCases.push(mock(schema, { strategy: "random", seed: 1 }));
	edgeCases.push(mock(schema, { strategy: "random", seed: 999999 }));
	edgeCases.push(mock(schema, { strategy: "edge-cases", seed: 42 }));

	return edgeCases;
}
