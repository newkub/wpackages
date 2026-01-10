import { abstractFactory, factoryFamily } from "./abstract-factory";

const darkThemeFactory = abstractFactory(() => ({
	background: "#000000",
	text: "#ffffff",
}));

const lightThemeFactory = abstractFactory(() => ({
	background: "#ffffff",
	text: "#000000",
}));

const themeFactories = factoryFamily({
	dark: darkThemeFactory,
	light: lightThemeFactory,
});

const darkTheme = themeFactories.dark.create();
const lightTheme = themeFactories.light.create();

console.log("Dark Theme:", darkTheme);
console.log("Light Theme:", lightTheme);
