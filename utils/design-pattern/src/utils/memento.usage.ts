import { caretaker, memento } from "./memento";

const history = caretaker<{ text: string }>();

let document = { text: "" };

document.text = "Hello";
history.save(memento(document));

document.text = "Hello World";
history.save(memento(document));

document.text = "Hello World!";
history.save(memento(document));

console.log("Current:", document);

const undo1 = history.undo();
if (undo1) {
	document = undo1.getState();
	console.log("After undo 1:", document);
}

const undo2 = history.undo();
if (undo2) {
	document = undo2.getState();
	console.log("After undo 2:", document);
}
