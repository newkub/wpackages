import { flyweightFactory } from "./flyweight";

const factory = flyweightFactory();

const tree1 = factory.getFlyweight("oak", () => ({ type: "oak", color: "green" }));
const tree2 = factory.getFlyweight("oak", () => ({ type: "oak", color: "green" }));
const tree3 = factory.getFlyweight("pine", () => ({ type: "pine", color: "dark green" }));

console.log("Tree1 === Tree2:", tree1 === tree2);
console.log("Tree1 === Tree3:", tree1 === tree3);
console.log("Total unique trees:", factory.getSize());
