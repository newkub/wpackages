/**
 * Boolean Mock Generator
 */

import type { MockOptions } from "../mock";
import { seededRandom } from "../mock";

export function booleanGenerator(_schema: any, _options: Required<MockOptions>): boolean {
	return seededRandom() < 0.5;
}
