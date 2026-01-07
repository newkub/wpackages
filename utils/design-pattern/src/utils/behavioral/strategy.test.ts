import { describe, expect, it } from 'vitest'
import { ConcreteStrategyA, Context } from './strategy'

describe('Strategy', () => {
  it('should enable selecting an algorithm at runtime', () => {
    const context = new Context(new ConcreteStrategyA())
    // This logs to console. We'd need to adapt for a pure test.
    // For now, just ensure it doesn't crash.
    expect(() => context.doSomeBusinessLogic()).not.toThrow()
  })
})
