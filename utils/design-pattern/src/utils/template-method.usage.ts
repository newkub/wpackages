import { TemplateMethod } from "./template-method";

class CoffeeMaker extends TemplateMethod {
	step1(): string {
		return "Boil water";
	}

	step2(): string {
		return "Add coffee grounds";
	}

	step3(): string {
		return "Pour coffee";
	}
}

class TeaMaker extends TemplateMethod {
	step1(): string {
		return "Boil water";
	}

	step2(): string {
		return "Add tea leaves";
	}

	step3(): string {
		return "Pour tea";
	}
}

const coffee = new CoffeeMaker();
const tea = new TeaMaker();

console.log("Coffee:", coffee.execute());
console.log("Tea:", tea.execute());
