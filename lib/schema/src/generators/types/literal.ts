/**
 * Literal Mock Generator
 */

import type { MockOptions } from "../mock";

export function literalGenerator(schema: any, _options: Required<MockOptions>): unknown {
	return schema._output;
}
