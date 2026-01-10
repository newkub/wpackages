import { proxy } from "../src/utils/proxy";

const user = {
	name: "John",
	age: 30,
};

const protectedUser = proxy(user, {
	get: (target, prop) => {
		if (prop === "age") {
			console.log("Accessing age is restricted");
			return undefined;
		}
		return target[prop as keyof typeof target];
	},
});

console.log(protectedUser.name);
console.log(protectedUser.age);
