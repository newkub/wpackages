import { mediator } from "./mediator";

const chat = mediator();

chat.register("Alice", (msg) => console.log("Alice received:", msg));
chat.register("Bob", (msg) => console.log("Bob received:", msg));
chat.register("Charlie", (msg) => console.log("Charlie received:", msg));

chat.send("Alice", "Bob", "Hi Bob!");
chat.broadcast("Charlie", "Hello everyone!");
