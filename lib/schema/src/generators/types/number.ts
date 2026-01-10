/**
 * Number Mock Generator
 */

import type { MockOptions } from "../mock";
import { seededRandom } from "../mock";

export function numberGenerator(schema: any, _options: Required<MockOptions>): number {
	const min = schema.min ?? 0;
	const max = schema.max ?? 100;
	const isInteger = schema.integer ?? false;

	let value = min + seededRandom() * (max - min);

	if (isInteger) {
		value = Math.floor(value);
	} else {
		value = Math.round(value * 100) / 100;
	}

	return value;
}
