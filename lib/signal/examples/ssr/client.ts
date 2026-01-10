import { hydrateOnClient, createSignal } from "@wpackages/signal";

export function initClient() {
	if (typeof window !== "undefined" && (window as any).__SIGNAL_STATE__) {
		hydrateOnClient((window as any).__SIGNAL_STATE__);
	}

	const [count, setCount] = createSignal(0);
	const [name] = createSignal("World");

	const app = document.getElementById("app");
	if (app) {
		app.innerHTML = `
      <h1>Hello, ${name()}!</h1>
      <p>Count: ${count()}</p>
      <button id="increment">Increment</button>
    `;

		document.getElementById("increment")?.addEventListener("click", () => {
			setCount((c) => c + 1);
			app.innerHTML = `
        <h1>Hello, ${name()}!</h1>
        <p>Count: ${count()}</p>
        <button id="increment">Increment</button>
      `;
		});
	}
}

initClient();
