/**
 * String Mock Generator
 */

import type { MockOptions } from "../mock";
import { seededRandom } from "../mock";

export function stringGenerator(schema: any, options: Required<MockOptions>): string {
	const min = schema.min || 1;
	const max = schema.max || 50;
	const pattern = schema.pattern;

	if (pattern) {
		return generateFromPattern(pattern, options);
	}

	const length = Math.floor(seededRandom() * (max - min + 1)) + min;
	return generateRandomString(length);
}

function generateRandomString(length: number): string {
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(seededRandom() * chars.length));
	}
	return result;
}

function generateFromPattern(pattern: RegExp, _options: Required<MockOptions>): string {
	const patternStr = pattern.toString();
	const simplePatterns: Record<string, string> = {
		"/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/": "test@example.com",
		"/^\\d{3}-\\d{3}-\\d{4}$/": "123-456-7890",
		"/^\\d{4}-\\d{2}-\\d{2}$/": "2024-01-01",
	};

	for (const [key, value] of Object.entries(simplePatterns)) {
		if (patternStr.includes(key.replace(/\//g, ""))) {
			return value;
		}
	}

	return generateRandomString(10);
}
