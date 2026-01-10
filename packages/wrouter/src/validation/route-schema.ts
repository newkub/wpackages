import { string, number, object, union, literal, optional } from "@wpackages/schema";
import type { RouteParam } from "../types";

export const routeParamSchema = object({
	shape: {
		name: string({ min: 1 }),
		type: union([literal("string"), literal("number"), literal("boolean")]),
		optional: literal(false),
	},
});

export const optionalRouteParamSchema = object({
	shape: {
		name: string({ min: 1 }),
		type: union([literal("string"), literal("number"), literal("boolean")]),
		optional: literal(true),
	},
});

export const routeParamWithOptionalSchema = union([routeParamSchema, optionalRouteParamSchema]);

export const paramsSchema = object({
	shape: {
		[string()]: union([string(), number(), literal(true), literal(false)]),
	},
});

export const querySchema = object({
	shape: {
		[string()]: optional(string()),
	},
});

export const routeMatchSchema = object({
	shape: {
		path: string(),
		params: paramsSchema,
		query: querySchema,
		hash: optional(string()),
	},
});

export const validateRouteParams = (params: Record<string, unknown>, expectedParams: readonly RouteParam[]) => {
	const schema = object({
		shape: Object.fromEntries(
			expectedParams.map((param) => [
				param.name,
				param.optional ? optional(union([string(), number(), literal(true), literal(false)])) : union([string(), number(), literal(true), literal(false)]),
			]),
		),
	});

	const result = schema.parse(params);
	return result.success ? { data: result.data, error: null } : { data: null, error: result.issues };
};

export const validateRouteQuery = (query: Record<string, string | undefined>) => {
	const schema = object({
		shape: {
			[string()]: optional(string()),
		},
	});

	const result = schema.parse(query);
	return result.success ? { data: result.data, error: null } : { data: null, error: result.issues };
};

export const createRouteSchema = <T extends Record<string, unknown>>(shape: {
	params?: Record<string, unknown>;
	query?: Record<string, unknown>;
	body?: T;
}) => {
	const paramsSchema = shape.params ? object({ shape: shape.params }) : undefined;
	const querySchema = shape.query ? object({ shape: shape.query }) : undefined;
	const bodySchema = shape.body ? object({ shape: shape.body }) : undefined;

	return {
		params: paramsSchema,
		query: querySchema,
		body: bodySchema,
	};
};
