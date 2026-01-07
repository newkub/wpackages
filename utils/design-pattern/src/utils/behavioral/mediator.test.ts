import { describe, expect, it, spyOn } from 'vitest'
import { Component1, Component2, ConcreteMediator } from './mediator'

describe('Mediator', () => {
  it('should reduce chaotic dependencies between objects', () => {
    const c1 = new Component1()
    const c2 = new Component2()
    new ConcreteMediator(c1, c2)
    const spy = spyOn(c2, 'doC')
    c1.doA()
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
