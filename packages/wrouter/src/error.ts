export class RouteNotFoundError extends Error {
	readonly _tag = "RouteNotFoundError";

	constructor(readonly pathname: string) {
		super(`Route not found: ${pathname}`);
		this.name = "RouteNotFoundError";
	}
}

export class RouteMatchError extends Error {
	readonly _tag = "RouteMatchError";

	constructor(readonly pathname: string, readonly reason: string) {
		super(`Failed to match route ${pathname}: ${reason}`);
		this.name = "RouteMatchError";
	}
}

export class InvalidRoutePathError extends Error {
	readonly _tag = "InvalidRoutePathError";

	constructor(readonly path: string, readonly reason: string) {
		super(`Invalid route path ${path}: ${reason}`);
		this.name = "InvalidRoutePathError";
	}
}

export class MiddlewareError extends Error {
	readonly _tag = "MiddlewareError";

	constructor(readonly middlewareName: string, readonly cause: unknown) {
		super(`Middleware ${middlewareName} failed: ${cause}`);
		this.name = "MiddlewareError";
	}
}

export class GuardError extends Error {
	readonly _tag = "GuardError";

	constructor(readonly guardName: string, readonly reason: string) {
		super(`Guard ${guardName} failed: ${reason}`);
		this.name = "GuardError";
	}
}
