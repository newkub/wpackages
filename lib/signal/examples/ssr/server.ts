import { createSignal, createSSRContext, serializeForSSR, getSSRScriptTag } from "@wpackages/signal";

export function renderApp() {
	const context = createSSRContext({ isServer: true });

	const html = context.withSSRContext(() => {
		const [count, setCount] = createSignal(0);
		const [name, setName] = createSignal("World");

		setCount(42);
		setName("Server");

		return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>SSR App</title>
        </head>
        <body>
          <div id="app">
            <h1>Hello, ${name()}!</h1>
            <p>Count: ${count()}</p>
          </div>
          ${getSSRScriptTag(serializeForSSR())}
        </body>
      </html>
    `;
	});

	return html;
}

console.log(renderApp());
