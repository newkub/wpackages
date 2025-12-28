import type { PatternMetadata } from "../../core/metadata";

export const metadata: PatternMetadata = {
	name: "Option Pattern",
	description:
		"Represents the presence or absence of a value explicitly, avoiding null/undefined checks and enabling safe composition.",
	tags: ["fp", "functional", "data"],
};

export type Option<T> = None | Some<T>;

export interface None {
	readonly _tag: "None";
}

export interface Some<T> {
	readonly _tag: "Some";
	readonly value: T;
}

export const none = (): None => ({ _tag: "None" });

export const some = <T>(value: T): Some<T> => ({ _tag: "Some", value });

export const fromNullable = <T>(value: T | null | undefined): Option<T> =>
	value === null || value === undefined ? none() : some(value);

export const map = <A, B>(fa: Option<A>, f: (a: A) => B): Option<B> => fa._tag === "Some" ? some(f(fa.value)) : fa;

export const flatMap = <A, B>(fa: Option<A>, f: (a: A) => Option<B>): Option<B> =>
	fa._tag === "Some" ? f(fa.value) : fa;

export const getOrElse = <A>(fa: Option<A>, onNone: () => A): A => fa._tag === "Some" ? fa.value : onNone();
