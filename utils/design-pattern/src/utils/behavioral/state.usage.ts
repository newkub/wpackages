import { ConcreteStateA, Context } from './state'

console.log('--- State ---')
const context = new Context(new ConcreteStateA())
context.request1()
context.request2()
