import routes from "virtual:vitext/routes";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
	app.innerText = JSON.stringify(routes, null, 2);
}
