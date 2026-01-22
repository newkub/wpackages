import { createWebServer } from "../lib";

export const app = createWebServer({ port: 3001, host: "localhost" });

// Basic routes without schema validation
app.get("/", () => ({ message: "Hello from WebServer!" }));

app.get("/health", () => ({ status: "ok" }));

// Current implementation
app.post("/api/data", async (request, _params) => {
	try {
		const body = await request.json();
		return { received: body };
	} catch (error) {
		return { error: "Failed to parse JSON", message: error instanceof Error ? error.message : "Unknown error" };
	}
});
