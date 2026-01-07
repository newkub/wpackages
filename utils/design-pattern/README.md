# Design Pattern Library

A collection of design patterns implemented in modern TypeScript.

## Implemented Patterns

| Category | Pattern | Description |
| --- | --- | --- |
| **Creational** | Singleton | Ensures a class has only one instance and provides a global point of access to it. |
| | Factory Method | Defines an interface for creating an object, but lets subclasses alter the type of objects that will be created. |
| | Abstract Factory | Provides an interface for creating families of related or dependent objects without specifying their concrete classes. |
| | Builder | Separates the construction of a complex object from its representation, allowing the same construction process to create various representations. |
| | Prototype | Specifies the kinds of objects to create using a prototypical instance, and creates new objects by copying this prototype. |
| | Object Pool | Manages a pool of reusable objects, which can be acquired and released, to improve performance by avoiding expensive object creation. |
| **Structural** | Adapter | Allows objects with incompatible interfaces to collaborate. |
| | Bridge | Decouples an abstraction from its implementation so that the two can vary independently. |
| | Composite | Composes objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly. |
| | Decorator | Attaches additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality. |
| | Facade | Provides a simplified interface to a library, a framework, or any other complex set of classes. |
| | Flyweight | Uses sharing to support large numbers of fine-grained objects efficiently. |
| | Proxy | Provides a surrogate or placeholder for another object to control access to it. |
| **Behavioral** | Chain of Responsibility | Avoids coupling the sender of a request to its receiver by giving more than one object a chance to handle the request. |
| | Command | Encapsulates a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations. |
| | Iterator | Provides a way to access the elements of an aggregate object sequentially without exposing its underlying representation. |
| | Mediator | Defines an object that encapsulates how a set of objects interact. Mediator promotes loose coupling by keeping objects from referring to each other explicitly. |
| | Memento | Without violating encapsulation, captures and externalizes an object's internal state so that the object can be restored to this state later. |
| | Observer | Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically. |
| | State | Allows an object to alter its behavior when its internal state changes. The object will appear to change its class. |
| | Strategy | Defines a family of algorithms, encapsulates each one, and makes them interchangeable. Strategy lets the algorithm vary independently from clients that use it. |
| | Template Method | Defines the skeleton of an algorithm in an operation, deferring some steps to subclasses. |
| | Visitor | Represents an operation to be performed on the elements of an object structure. Visitor lets you define a new operation without changing the classes of the elements on which it operates. |


### Creational Patterns

- Singleton
- Factory Method
- Abstract Factory
- Builder
- Prototype
- Object Pool

### Structural Patterns

- Adapter
- Bridge
- Composite
- Decorator
- Facade
- Flyweight
- Proxy

### Behavioral Patterns

- Chain of Responsibility
- Command
- Iterator
- Mediator
- Memento
- Observer
- State
- Strategy
- Template Method
- Visitor

## Project Structure

The project is organized by functional categories:

- `src/services`: Contains patterns that manage state or resources (e.g., `Singleton`, `ObjectPool`).
- `src/utils`: Contains patterns that provide reusable logic and structure, further grouped by:
  - `creational`
  - `structural`
  - `behavioral`
- `src/types`: Contains all shared TypeScript interfaces and types.

Each pattern file is co-located with its corresponding test file (`.test.ts`) and usage example (`.usage.ts`).

## Usage

All patterns are exported from the main `src/index.ts` file. You can import them as follows:

```typescript
import { Singleton } from '@wpackages/design-pattern';
```

To run a specific usage example:

```bash
bun src/services/singleton.service.usage.ts
