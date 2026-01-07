import { describe, expect, it } from 'vitest'
import { ComponentWithBackReference, Prototype } from './prototype'

describe('Prototype', () => {
  it('should clone an object', () => {
    const p1 = new Prototype()
    p1.primitive = 245
    p1.component = new Date()
    p1.circularReference = new ComponentWithBackReference(p1)
    const p2 = p1.clone()
    expect(p1.primitive).toBe(p2.primitive)
    expect(p1.component).not.toBe(p2.component)
    expect(p1.circularReference).not.toBe(p2.circularReference)
  })
})
