import { factoryWithParams } from "./factory";

class Product {
	constructor(public id: number, public name: string) {}
}

const createProduct = factoryWithParams((id: number, name: string) => new Product(id, name));

const product1 = createProduct(1, "Laptop");
const product2 = createProduct(2, "Phone");

console.log(product1);
console.log(product2);
