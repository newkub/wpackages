import { builder } from "./builder";

interface User {
	id: number;
	name: string;
	email: string;
	age?: number;
}

const user = builder<User>()
	.set("id", 1)
	.set("name", "John Doe")
	.set("email", "john@example.com")
	.set("age", 30)
	.build();

console.log(user);
