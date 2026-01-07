import { describe, expect, it } from 'vitest'
import { FlyweightFactory } from './flyweight'

describe('Flyweight', () => {
  it('should use sharing to support large numbers of fine-grained objects efficiently', () => {
    const factory = new FlyweightFactory([['a', 'b']])
    const flyweight1 = factory.getFlyweight(['a', 'b'])
    const flyweight2 = factory.getFlyweight(['a', 'b'])
    expect(flyweight1).toBe(flyweight2)
  })
})
