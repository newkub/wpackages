import type { Result, Schema } from "../../../types/core";
import { createSchema } from "../../core/schema";

// Intersection schema
export function intersection<A, B>(schemaA: Schema<A>, schemaB: Schema<B>): Schema<A & B> {
	return createSchema("intersection", (value): Result<A & B> => {
		const resultA = schemaA.safeParse(value);
		if (!resultA.success) {
			return resultA;
		}

		const resultB = schemaB.safeParse(value);
		if (!resultB.success) {
			return resultB;
		}

		return { success: true, data: { ...resultA.data, ...resultB.data } as A & B };
	});
}
