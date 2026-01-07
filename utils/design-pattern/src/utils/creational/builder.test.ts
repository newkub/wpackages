import { describe, expect, it } from 'vitest'
import { ConcreteBuilder1, Director } from './builder'

describe('Builder', () => {
  it('should build a product', () => {
    const director = new Director()
    const builder = new ConcreteBuilder1()
    director.setBuilder(builder)
    director.buildMinimalViableProduct()
    const product = builder.getProduct()
    expect(product.parts).toEqual(['PartA1'])
  })
})
