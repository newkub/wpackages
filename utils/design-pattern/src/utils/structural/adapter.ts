import type { Target } from '../../types/structural.types'

class Adaptee {
  public specificRequest(): string {
    return '.eetpadA eht fo roivaheb laicepS'
  }
}

export class Adapter extends Adaptee implements Target {
  public request(): string {
    const result = this.specificRequest().split('').reverse().join('')
    return `Adapter: (TRANSLATED) ${result}`
  }
}
