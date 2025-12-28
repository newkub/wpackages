import type { PatternMetadata } from "../../core/metadata";

export const metadata: PatternMetadata = {
	name: "Specification Pattern",
	description: "Encapsulates business rules as composable predicates that can be combined and reused.",
	tags: ["business", "functional", "business-rules"],
};

export interface Specification<A> {
	readonly isSatisfiedBy: (a: A) => boolean;
	readonly and: (other: Specification<A>) => Specification<A>;
	readonly or: (other: Specification<A>) => Specification<A>;
	readonly not: () => Specification<A>;
}

export const createSpecification = <A>(predicate: (a: A) => boolean): Specification<A> => ({
	isSatisfiedBy: predicate,
	and: (other) => createSpecification((a) => predicate(a) && other.isSatisfiedBy(a)),
	or: (other) => createSpecification((a) => predicate(a) || other.isSatisfiedBy(a)),
	not: () => createSpecification((a) => !predicate(a)),
});
