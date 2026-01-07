import { describe, expect, it } from 'vitest'
import { Abstraction, ConcreteImplementationA } from './bridge'

describe('Bridge', () => {
  it('should link abstraction and implementation', () => {
    const implementation = new ConcreteImplementationA()
    const abstraction = new Abstraction(implementation)
    expect(abstraction.operation()).toContain('platform A')
  })
})
