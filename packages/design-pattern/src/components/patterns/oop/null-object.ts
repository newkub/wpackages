import type { PatternMetadata } from "../../core/metadata";

export const metadata: PatternMetadata = {
	name: "Null Object Pattern",
	description: "Provides a non-operative default implementation to avoid null checks and reduce conditional branching.",
	tags: ["oop", "functional", "default"],
};

export const createNullObject = <T extends object>(shape: T): T => shape;

export const withFallback = <T>(value: T | null | undefined, fallback: T): T =>
	value === null || value === undefined ? fallback : value;
