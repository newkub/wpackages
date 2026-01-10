import { decorator } from "../src/utils/decorator";

interface Component {
	render(): string;
}

class Button implements Component {
	render() {
		return `<button>Click me</button>`;
	}
}

const borderedButton = decorator(new Button(), {
	render: () => `<button style="border: 2px solid black">Click me</button>`,
});

console.log(borderedButton.render());
