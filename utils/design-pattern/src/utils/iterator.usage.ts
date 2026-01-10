import { iterator } from "./iterator";

const users = [
	{ id: 1, name: "Alice" },
	{ id: 2, name: "Bob" },
	{ id: 3, name: "Charlie" },
];

const userIterator = iterator(users);

while (userIterator.hasNext()) {
	const user = userIterator.next().value;
	console.log(user);
}
