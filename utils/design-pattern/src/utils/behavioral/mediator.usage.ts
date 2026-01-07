import { Component1, Component2, ConcreteMediator } from './mediator'

console.log('--- Mediator ---')
const c1 = new Component1()
const c2 = new Component2()
new ConcreteMediator(c1, c2)
console.log('Client triggers operation A.')
c1.doA()
console.log('')
console.log('Client triggers operation D.')
c2.doD()
