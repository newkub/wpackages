import { describe, expect, it } from 'vitest'
import { ConcreteComponent, ConcreteDecoratorA } from './decorator'

describe('Decorator', () => {
  it('should decorate a component', () => {
    const component = new ConcreteComponent()
    const decorator = new ConcreteDecoratorA(component)
    expect(decorator.operation()).toBe('ConcreteDecoratorA(ConcreteComponent)')
  })
})
