/**
 * Array Mock Generator
 */

import type { MockOptions } from "../mock";
import { generateMock, seededRandom } from "../mock";

export function arrayGenerator(schema: any, options: Required<MockOptions>, depth: number): unknown[] {
	const itemSchema = schema.item;
	const length = Math.floor(seededRandom() * 5) + 1;

	const result: unknown[] = [];
	for (let i = 0; i < length; i++) {
		result.push(generateMock(itemSchema, options, depth + 1));
	}

	return result;
}
