export class Memento<T> {
	constructor(private state: T) {}

	getState(): T {
		return this.state;
	}
}

export class Caretaker<T> {
	private mementos: Memento<T>[] = [];

	save(memento: Memento<T>): void {
		this.mementos.push(memento);
	}

	undo(): Memento<T> | undefined {
		return this.mementos.pop();
	}
}

export function memento<T>(state: T): Memento<T> {
	return new Memento(state);
}

export function caretaker<T>(): Caretaker<T> {
	return new Caretaker<T>();
}
