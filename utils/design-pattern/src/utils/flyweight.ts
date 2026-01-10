export class FlyweightFactory {
	private flyweights = new Map<string, any>();

	getFlyweight(key: string, creator: () => any): any {
		if (!this.flyweights.has(key)) {
			this.flyweights.set(key, creator());
		}
		return this.flyweights.get(key);
	}

	getSize(): number {
		return this.flyweights.size;
	}
}

export function flyweightFactory(): FlyweightFactory {
	return new FlyweightFactory();
}
