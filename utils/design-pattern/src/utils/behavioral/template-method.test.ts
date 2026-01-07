import { describe, expect, it, spyOn } from 'vitest'
import { ConcreteClass1 } from './template-method'

describe('Template Method', () => {
  it('should define the skeleton of an algorithm in an operation', () => {
    const concrete = new ConcreteClass1()
    const spy1 = spyOn(concrete, 'requiredOperations1' as any)
    const spy2 = spyOn(concrete, 'requiredOperation2' as any)
    concrete.templateMethod()
    expect(spy1).toHaveBeenCalled()
    expect(spy2).toHaveBeenCalled()
    spy1.mockRestore()
    spy2.mockRestore()
  })
})
