import { describe, expect, it } from 'vitest'
import { ConcreteFactory1 } from './abstract-factory'

describe('AbstractFactory', () => {
  it('should create a family of products', () => {
    const factory = new ConcreteFactory1()
    const productA = factory.createProductA()
    const productB = factory.createProductB()
    expect(productA.usefulFunctionA()).toContain('A1')
    expect(productB.usefulFunctionB()).toContain('B1')
  })
})
