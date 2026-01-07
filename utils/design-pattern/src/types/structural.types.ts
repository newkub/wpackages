// Adapter
export interface Target {
  request(): string
}

// Bridge
export interface Implementation {
  operationImplementation(): string
}

// Decorator
export interface Component {
  operation(): string
}

// Proxy
export interface Subject {
  request(): void
}
