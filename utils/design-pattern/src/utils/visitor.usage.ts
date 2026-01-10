import { ConcreteElementA, ConcreteElementB, visitor } from "./visitor";

const elementA = new ConcreteElementA();
const elementB = new ConcreteElementB();

const visitorInstance = visitor();

elementA.accept(visitorInstance);
elementB.accept(visitorInstance);
