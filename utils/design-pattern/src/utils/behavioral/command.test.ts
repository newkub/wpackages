import { describe, expect, it, spyOn } from 'vitest'
import { ComplexCommand, Invoker, Receiver } from './command'

describe('Command', () => {
  it('should execute a command', () => {
    const invoker = new Invoker()
    const receiver = new Receiver()
    const command = new ComplexCommand(receiver, 'Send email', 'Save report')
    const spy = spyOn(command, 'execute')
    invoker.setOnFinish(command)
    invoker.doSomethingImportant()
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
