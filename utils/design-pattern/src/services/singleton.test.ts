import { describe, expect, it } from 'vitest'
import { Singleton } from './singleton'

describe('Singleton', () => {
  it('should create only one instance', () => {
    const s1 = Singleton.getInstance()
    const s2 = Singleton.getInstance()
    expect(s1).toBe(s2)
  })
})
