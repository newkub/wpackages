export interface Builder<T> {
	build(): T;
}

export class ProductBuilder<T extends Record<string, any>> implements Builder<T> {
	private product: Partial<T> = {};

	set<K extends keyof T>(key: K, value: T[K]): this {
		this.product[key] = value;
		return this;
	}

	build(): T {
		return this.product as T;
	}
}

export function builder<T>(): ProductBuilder<T> {
	return new ProductBuilder<T>();
}
