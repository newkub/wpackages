import {
  ConcreteComponent,
  ConcreteDecoratorA,
  ConcreteDecoratorB
} from './decorator'

console.log('--- Decorator ---')
const simple = new ConcreteComponent()
console.log("Client: I've got a simple component:")
console.log(`RESULT: ${simple.operation()}`)
const decorator1 = new ConcreteDecoratorA(simple)
const decorator2 = new ConcreteDecoratorB(decorator1)
console.log("Client: Now I've got a decorated component:")
console.log(`RESULT: ${decorator2.operation()}`)
