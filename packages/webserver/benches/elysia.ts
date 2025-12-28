import { Elysia } from 'elysia';

export function createElysiaServer() {
  return new Elysia()
    .get('/', () => 'Welcome to the homepage!')
    .get('/users', () => ({ id: 1, name: 'John Doe' }))
    .get('/search', ({ query }) => query)
    .post('/echo', ({ body }) => ({ received: body }));
}

async function startServer() {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 0;
  const app = createElysiaServer().listen(port);
  console.log(`Elysia server running at http://${app.server?.hostname}:${app.server?.port}`);
}

if (import.meta.main) {
  startServer();
}
