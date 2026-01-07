import { ConcreteFactory1, ConcreteFactory2 } from './abstract-factory'

console.log('--- Abstract Factory ---')
const factory1 = new ConcreteFactory1()
const productA1 = factory1.createProductA()
const productB1 = factory1.createProductB()
console.log(productB1.usefulFunctionB())
console.log(productB1.anotherUsefulFunctionB(productA1))

const factory2 = new ConcreteFactory2()
const productA2 = factory2.createProductA()
const productB2 = factory2.createProductB()
console.log(productB2.usefulFunctionB())
console.log(productB2.anotherUsefulFunctionB(productA2))
