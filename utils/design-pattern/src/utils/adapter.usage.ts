import { adapter } from "../src/utils/adapter";

interface Celsius {
	value: number;
	unit: "C";
}

interface Fahrenheit {
	value: number;
	unit: "F";
}

const celsiusToFahrenheit = adapter((celsius: Celsius): Fahrenheit => ({
	value: (celsius.value * 9) / 5 + 32,
	unit: "F",
}));

const tempInC: Celsius = { value: 25, unit: "C" };
const tempInF = celsiusToFahrenheit(tempInC);

console.log(`${tempInC.value}°C = ${tempInF.value}°F`);
