import { Effect } from "effect";
import type { Result } from "@wpackages/plugins-system";

export const resultToEffect = <A, E>(result: Result<A, E>): Effect.Effect<A, E> => {
	if (result.isOk()) {
		return Effect.succeed(result.unwrap());
	}
	return Effect.fail(result.unwrapErr());
};

export const resultToEffectAsync = <A, E>(
	result: Promise<Result<A, E>>,
): Effect.Effect<A, E> => {
	return Effect.tryPromise({
		try: async () => {
			const r = await result;
			if (r.isOk()) {
				return r.unwrap();
			}
			throw r.unwrapErr();
		},
		catch: (e) => e as E,
	});
};
