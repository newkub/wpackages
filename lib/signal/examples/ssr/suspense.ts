import { createSuspense, createSSRContext } from "@wpackages/signal";

export async function renderWithSuspense() {
	const context = createSSRContext({ isServer: true });

	const html = await context.withSSRContext(async () => {
		const suspense = createSuspense(
			async () => {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				return "Async Data Loaded!";
			},
			{ fallback: "Loading..." },
		);

		return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Suspense SSR</title>
        </head>
        <body>
          <div id="app">
            <h1>Suspense Example</h1>
            <p>${suspense.loading ? "Loading..." : suspense.data}</p>
            ${suspense.error ? `<p>Error: ${String(suspense.error)}</p>` : ""}
          </div>
        </body>
      </html>
    `;
	});

	return html;
}

renderWithSuspense().then(console.log);
