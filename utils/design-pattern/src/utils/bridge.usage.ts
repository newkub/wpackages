import { bridge, type Implementation } from "./bridge";

const windowsRenderer: Implementation = {
	operationImplementation: () => "Rendered on Windows",
};

const macRenderer: Implementation = {
	operationImplementation: () => "Rendered on Mac",
};

const windowsButton = bridge(windowsRenderer);
const macButton = bridge(macRenderer);

console.log(windowsButton.operation());
console.log(macButton.operation());
