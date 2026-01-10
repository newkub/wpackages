export interface Abstraction {
	operation(): string;
}

export interface Implementation {
	operationImplementation(): string;
}

export class Bridge implements Abstraction {
	constructor(private implementation: Implementation) {}

	operation(): string {
		return this.implementation.operationImplementation();
	}
}

export function bridge(implementation: Implementation): Abstraction {
	return new Bridge(implementation);
}
