import { describe, expect, it, spyOn } from 'vitest'
import { ConcreteStateA, Context } from './state'

describe('State', () => {
  it('should alter its behavior when its internal state changes', () => {
    const context = new Context(new ConcreteStateA())
    const spy = spyOn(context, 'transitionTo')
    context.request1()
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
