/**
 * Intersection Mock Generator
 */

import type { MockOptions } from "../mock";
import { generateMock } from "../mock";

export function intersectionGenerator(schema: any, options: Required<MockOptions>, depth: number): unknown {
	const schemas = schema.schemas || [];
	const result: Record<string, unknown> = {};

	for (const s of schemas) {
		const data = generateMock(s, options, depth + 1);
		if (typeof data === "object" && data !== null) {
			Object.assign(result, data);
		}
	}

	return result;
}
