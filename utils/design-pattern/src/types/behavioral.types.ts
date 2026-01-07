// Chain of Responsibility
export interface Handler {
  setNext(handler: Handler): Handler
  handle(request: string): string | null
}

// Command
export interface Command {
  execute(): void
}

// Iterator
export interface Iterator<T> {
  current(): T
  next(): T
  key(): number
  valid(): boolean
  rewind(): void
}

export interface Aggregator {
  getIterator(): Iterator<string>
}

// Mediator
export interface Mediator {
  notify(sender: object, event: string): void
}

// Memento
export interface Memento {
  getState(): string
  getName(): string
  getDate(): string
}

// Observer
export interface Observer {
  update(subject: Subject): void
}

export interface Subject {
  attach(observer: Observer): void
  detach(observer: Observer): void
  notify(): void
}

// Strategy
export interface Strategy {
  doAlgorithm(data: string[]): string[]
}

// Visitor
export interface Visitor {
  visitConcreteComponentA(element: any): void
  visitConcreteComponentB(element: any): void
}

export interface Component {
  accept(visitor: Visitor): void
}
