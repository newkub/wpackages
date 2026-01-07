import { ConcreteClass1, ConcreteClass2 } from './template-method'

console.log('--- Template Method ---')
console.log('Same client code can work with different subclasses:')
const concreteClass1 = new ConcreteClass1()
concreteClass1.templateMethod()
console.log('')
console.log('Same client code can work with different subclasses:')
const concreteClass2 = new ConcreteClass2()
concreteClass2.templateMethod()
