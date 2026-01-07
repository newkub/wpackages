import { describe, expect, it } from 'vitest'
import { ConcreteCreator1 } from './factory-method'

describe('FactoryMethod', () => {
  it('should create a product', () => {
    const creator = new ConcreteCreator1()
    expect(creator.someOperation()).toContain('ConcreteProduct1')
  })
})
