import { describe, expect, it, spyOn } from 'vitest'
import { Proxy } from './proxy'

describe('Proxy', () => {
  it('should control access to the real subject', () => {
    class RealSubject {
      public request() {}
    }
    const realSubject = new RealSubject()
    const spy = spyOn(realSubject, 'request')
    const proxy = new Proxy(realSubject as any)
    proxy.request()
    expect(spy).toHaveBeenCalled()
  })
})
