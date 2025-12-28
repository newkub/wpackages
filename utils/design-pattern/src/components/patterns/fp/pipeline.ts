import type { PatternMetadata } from "../../core/metadata";

export const metadata: PatternMetadata = {
	name: "Pipeline Pattern",
	description: "Builds a processing pipeline by composing multiple small transformations into a single operation.",
	tags: ["fp", "functional", "composition"],
};

export type Unary<A, B> = (a: A) => B;

export const pipe2 = <A, B, C>(ab: Unary<A, B>, bc: Unary<B, C>): Unary<A, C> => (a) => bc(ab(a));

export const pipe3 = <A, B, C, D>(ab: Unary<A, B>, bc: Unary<B, C>, cd: Unary<C, D>): Unary<A, D> => (a) =>
	cd(bc(ab(a)));

export const pipeMany = <A>(...fns: ReadonlyArray<Unary<A, A>>): Unary<A, A> => (a) => fns.reduce((x, f) => f(x), a);
