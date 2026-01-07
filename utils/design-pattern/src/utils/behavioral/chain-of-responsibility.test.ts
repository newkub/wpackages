import { describe, expect, it } from 'vitest'
import { MonkeyHandler, SquirrelHandler } from './chain-of-responsibility'

describe('Chain of Responsibility', () => {
  it('should pass the request along the chain', () => {
    const monkey = new MonkeyHandler()
    const squirrel = new SquirrelHandler()
    monkey.setNext(squirrel)
    expect(monkey.handle('Nut')).toContain('Squirrel')
    expect(monkey.handle('Banana')).toContain('Monkey')
    expect(monkey.handle('Coffee')).toBe(null)
  })
})
