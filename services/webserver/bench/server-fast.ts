// Ultra-fast benchmark server using Bun.serve with raw HTTP response
// Pre-allocated raw response for maximum speed
const HEALTH_RESPONSE = new Response('{"status":"ok"}', {
  status: 200,
  headers: { "Content-Type": "application/json; charset=utf-8" },
});

const server = Bun.serve({
  port: 3000,
  hostname: "localhost",
  fetch(request) {
    const url = request.url;
    const method = request.method;

    // Fast path: health endpoint - return pre-allocated response
    if (url === "http://localhost:3000/health" && method === "GET") {
      return HEALTH_RESPONSE;
    }

    // Fast path: endpoint with path params
    if (url.startsWith("http://localhost:3000/api/data/") && method === "GET") {
      const id = url.slice(31); // "http://localhost:3000/api/data/" = 31 chars
      return new Response(`{"id":"${id}","data":"test"}`, {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }

    // Fast path: POST endpoint
    if (url === "http://localhost:3000/api/data" && method === "POST") {
      try {
        const body = request.json();
        return new Response(JSON.stringify({ received: body }), {
          status: 200,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        });
      } catch {
        return new Response('{"error":"Failed to parse JSON"}', {
          status: 400,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        });
      }
    }

    return new Response('{"error":"Not Found"}', {
      status: 404,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  },
});

console.log(`🚀 Ultra-fast server running at http://${server.hostname}:${server.port}`);
