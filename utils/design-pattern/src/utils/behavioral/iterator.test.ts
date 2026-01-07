import { describe, expect, it } from 'vitest'
import { WordsCollection } from './iterator'

describe('Iterator', () => {
  it('should traverse a collection', () => {
    const collection = new WordsCollection()
    collection.addItem('First')
    collection.addItem('Second')
    const iterator = collection.getIterator()
    expect(iterator.next()).toBe('First')
    expect(iterator.next()).toBe('Second')
  })
})
