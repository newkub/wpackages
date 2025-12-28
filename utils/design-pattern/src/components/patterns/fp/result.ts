import type { PatternMetadata } from "../../core/metadata";

export const metadata: PatternMetadata = {
	name: "Result Pattern",
	description: "Encodes success and failure as values, enabling composable error handling without throwing exceptions.",
	tags: ["fp", "functional", "error-handling"],
};

export type Result<A, E> = Ok<A> | Err<E>;

export interface Ok<A> {
	readonly _tag: "Ok";
	readonly value: A;
}

export interface Err<E> {
	readonly _tag: "Err";
	readonly error: E;
}

export const ok = <A>(value: A): Ok<A> => ({ _tag: "Ok", value });

export const err = <E>(error: E): Err<E> => ({ _tag: "Err", error });

export const map = <A, B, E>(fa: Result<A, E>, f: (a: A) => B): Result<B, E> => fa._tag === "Ok" ? ok(f(fa.value)) : fa;

export const flatMap = <A, B, E>(fa: Result<A, E>, f: (a: A) => Result<B, E>): Result<B, E> =>
	fa._tag === "Ok" ? f(fa.value) : fa;

export const mapError = <A, E1, E2>(fa: Result<A, E1>, f: (e: E1) => E2): Result<A, E2> =>
	fa._tag === "Err" ? err(f(fa.error)) : fa;

export const match = <A, E, R>(
	fa: Result<A, E>,
	handlers: { readonly onOk: (a: A) => R; readonly onErr: (e: E) => R },
): R => (fa._tag === "Ok" ? handlers.onOk(fa.value) : handlers.onErr(fa.error));
