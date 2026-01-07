import { describe, expect, it } from 'vitest'
import { Adapter } from './adapter'

describe('Adapter', () => {
  it('should adapt the adaptee', () => {
    const adapter = new Adapter()
    expect(adapter.request()).toContain('Special behavior of the Adaptee.')
  })
})
