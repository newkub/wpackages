// Abstract Factory
export interface AbstractProductA {
  usefulFunctionA(): string
}

export interface AbstractProductB {
  usefulFunctionB(): string
  anotherUsefulFunctionB(collaborator: AbstractProductA): string
}

export interface AbstractFactory {
  createProductA(): AbstractProductA
  createProductB(): AbstractProductB
}

// Factory Method
export interface Product {
  operation(): string
}

// Object Pool
export interface PoolObject {
  _id: number
}
