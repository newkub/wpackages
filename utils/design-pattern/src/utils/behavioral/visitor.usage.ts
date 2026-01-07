import {
  ConcreteComponentA,
  ConcreteComponentB,
  ConcreteVisitor1,
  ConcreteVisitor2
} from './visitor'

console.log('--- Visitor ---')
const components = [new ConcreteComponentA(), new ConcreteComponentB()]
console.log(
  'The client code works with all visitors via the base Visitor interface:'
)
const visitor1 = new ConcreteVisitor1()
for (const component of components) {
  component.accept(visitor1)
}
console.log('')
console.log(
  'It allows the same client code to work with different types of visitors:'
)
const visitor2 = new ConcreteVisitor2()
for (const component of components) {
  component.accept(visitor2)
}
