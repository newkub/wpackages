import { describe, expect, it, spyOn } from 'vitest'
import { ConcreteComponentA, ConcreteVisitor1 } from './visitor'

describe('Visitor', () => {
  it('should represent an operation to be performed on the elements of an object structure', () => {
    const component = new ConcreteComponentA()
    const visitor = new ConcreteVisitor1()
    const spy = spyOn(visitor, 'visitConcreteComponentA')
    component.accept(visitor)
    expect(spy).toHaveBeenCalledWith(component)
    spy.mockRestore()
  })
})
