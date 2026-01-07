import type { Component } from '../../types/structural.types'

export class ConcreteComponent implements Component {
  public operation(): string {
    return 'ConcreteComponent'
  }
}

class Decorator implements Component {
  protected component: Component

  constructor(component: Component) {
    this.component = component
  }

  public operation(): string {
    return this.component.operation()
  }
}

export class ConcreteDecoratorA extends Decorator {
  public operation(): string {
    return `ConcreteDecoratorA(${super.operation()})`
  }
}

export class ConcreteDecoratorB extends Decorator {
  public operation(): string {
    return `ConcreteDecoratorB(${super.operation()})`
  }
}
