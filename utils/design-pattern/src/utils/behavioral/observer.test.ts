import { describe, expect, it, spyOn } from 'vitest'
import { ConcreteObserverA, ConcreteSubject } from './observer'

describe('Observer', () => {
  it('should notify observers about changes', () => {
    const subject = new ConcreteSubject()
    const observer = new ConcreteObserverA()
    const spy = spyOn(observer, 'update')
    subject.attach(observer)
    subject.state = 1 // A condition ConcreteObserverA reacts to
    subject.notify()
    expect(spy).toHaveBeenCalledWith(subject)
    spy.mockRestore()
  })
})
