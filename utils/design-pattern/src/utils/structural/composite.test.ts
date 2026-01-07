import { describe, expect, it } from 'vitest'
import { Composite, Leaf } from './composite'

describe('Composite', () => {
  it('should treat individual and composite objects uniformly', () => {
    const tree = new Composite()
    tree.add(new Leaf())
    expect(tree.operation()).toBe('Branch(Leaf)')
  })
})
