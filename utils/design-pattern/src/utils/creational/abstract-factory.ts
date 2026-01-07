import type {
  AbstractFactory,
  AbstractProductA,
  AbstractProductB
} from '../../types/creational.types'

class ConcreteProductA1 implements AbstractProductA {
  public usefulFunctionA(): string {
    return 'The result of the product A1.'
  }
}

class ConcreteProductB1 implements AbstractProductB {
  public usefulFunctionB(): string {
    return 'The result of the product B1.'
  }

  public anotherUsefulFunctionB(collaborator: AbstractProductA): string {
    const result = collaborator.usefulFunctionA()
    return `The result of the B1 collaborating with the (${result})`
  }
}

class ConcreteProductA2 implements AbstractProductA {
  public usefulFunctionA(): string {
    return 'The result of the product A2.'
  }
}

class ConcreteProductB2 implements AbstractProductB {
  public usefulFunctionB(): string {
    return 'The result of the product B2.'
  }

  public anotherUsefulFunctionB(collaborator: AbstractProductA): string {
    const result = collaborator.usefulFunctionA()
    return `The result of the B2 collaborating with the (${result})`
  }
}

export class ConcreteFactory1 implements AbstractFactory {
  public createProductA(): AbstractProductA {
    return new ConcreteProductA1()
  }

  public createProductB(): AbstractProductB {
    return new ConcreteProductB1()
  }
}

export class ConcreteFactory2 implements AbstractFactory {
  public createProductA(): AbstractProductA {
    return new ConcreteProductA2()
  }

  public createProductB(): AbstractProductB {
    return new ConcreteProductB2()
  }
}
