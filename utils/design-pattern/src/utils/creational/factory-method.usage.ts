import { ConcreteCreator1, ConcreteCreator2 } from './factory-method'

console.log('--- Factory Method ---')
const creator1 = new ConcreteCreator1()
console.log('App: Launched with the ConcreteCreator1.')
console.log(creator1.someOperation())

const creator2 = new ConcreteCreator2()
console.log('App: Launched with the ConcreteCreator2.')
console.log(creator2.someOperation())
