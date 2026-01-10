import { clone, prototype } from "./prototype";

const originalDocument = {
	id: 1,
	title: "Document",
	content: "Content",
};

const createDocument = prototype(originalDocument);

const doc1 = createDocument();
const doc2 = clone(originalDocument);

doc1.title = "Modified Document";

console.log("Original:", originalDocument);
console.log("Doc1:", doc1);
console.log("Doc2:", doc2);
