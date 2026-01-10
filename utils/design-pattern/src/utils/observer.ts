type Listener<T> = (data: T) => void;

export class Observable<T> {
	private listeners = new Set<Listener<T>>();

	subscribe(listener: Listener<T>): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	notify(data: T): void {
		this.listeners.forEach((listener) => listener(data));
	}
}
