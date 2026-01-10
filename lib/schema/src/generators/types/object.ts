/**
 * Object Mock Generator
 */

import type { MockOptions } from "../mock";
import { generateMock } from "../mock";

export function objectGenerator(schema: any, options: Required<MockOptions>, depth: number): Record<string, unknown> {
	const shape = schema.shape || {};
	const result: Record<string, unknown> = {};

	for (const key in shape) {
		if (Object.hasOwn(shape, key)) {
			const fieldSchema = shape[key];
			result[key] = generateMock(fieldSchema, options, depth + 1);
		}
	}

	return result;
}
