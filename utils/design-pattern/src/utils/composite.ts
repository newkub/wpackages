export interface Component {
	operation(): string;
}

export class Leaf implements Component {
	constructor(private name: string) {}

	operation(): string {
		return `Leaf: ${this.name}`;
	}
}

export class Composite implements Component {
	private children: Component[] = [];

	add(component: Component): void {
		this.children.push(component);
	}

	remove(component: Component): void {
		const index = this.children.indexOf(component);
		if (index > -1) {
			this.children.splice(index, 1);
		}
	}

	operation(): string {
		const results = this.children.map((child) => child.operation());
		return `Composite(${results.join(", ")})`;
	}
}

export function composite(name: string): Composite {
	return new Composite();
}

export function leaf(name: string): Leaf {
	return new Leaf(name);
}
