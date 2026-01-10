/**
 * Union Mock Generator
 */

import type { MockOptions } from "../mock";
import { generateMock } from "../mock";
import { seededRandom } from "../mock";

export function unionGenerator(schema: any, options: Required<MockOptions>, depth: number): unknown {
	const schemas = schema.schemas || [];
	if (schemas.length === 0) {
		return null;
	}

	const index = Math.floor(seededRandom() * schemas.length);
	return generateMock(schemas[index], options, depth + 1);
}
