export interface Visitor {
	visit(element: Visitable): void;
}

export interface Visitable {
	accept(visitor: Visitor): void;
}

export class ConcreteElementA implements Visitable {
	accept(visitor: Visitor): void {
		visitor.visit(this);
	}

	operationA(): string {
		return "Operation A";
	}
}

export class ConcreteElementB implements Visitable {
	accept(visitor: Visitor): void {
		visitor.visit(this);
	}

	operationB(): string {
		return "Operation B";
	}
}

export class ConcreteVisitor implements Visitor {
	visit(element: Visitable): void {
		if (element instanceof ConcreteElementA) {
			console.log("Visitor processing:", element.operationA());
		} else if (element instanceof ConcreteElementB) {
			console.log("Visitor processing:", element.operationB());
		}
	}
}

export function visitor(): Visitor {
	return new ConcreteVisitor();
}
