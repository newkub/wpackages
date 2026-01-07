import { describe, expect, it } from 'vitest'
import { ObjectPool } from './object-pool'

describe('ObjectPool', () => {
  it('should reuse objects', () => {
    class MyPoolObject {
      _id = 0
    }
    const pool = new ObjectPool(() => new MyPoolObject())
    const obj1 = pool.acquire()
    pool.release(obj1)
    const obj2 = pool.acquire()
    expect(obj1).toBe(obj2)
  })
})
