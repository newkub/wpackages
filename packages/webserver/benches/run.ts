import { execa } from 'execa';
import type { ExecaChildProcess } from 'execa';
import autocannon from 'autocannon';
import getPort from 'get-port';

// Helper to wait for a server to output its "running" message
function waitForServer(serverProcess: ExecaChildProcess): Promise<void> {
  return new Promise((resolve, reject) => {
    serverProcess.stdout?.on('data', (data: Buffer) => {
      const message = data.toString();
      if (message.includes('Server running at') || message.includes('Elysia server running at')) {
        resolve();
      }
    });

    serverProcess.stderr?.on('data', (data: Buffer) => {
      console.error(`Error starting server: ${data.toString()}`);
    });

    serverProcess.on('exit', (code: number | null) => {
      if (code !== 0 && code !== null) {
        reject(new Error(`Server process exited with code ${code}`));
      }
    });
  });
}

const scenarios = {
  'Simple Text': { path: '/' },
  'JSON Serialization': { path: '/users' },
  'Query Parsing': { path: '/search?q=hello&limit=10' },
  'Body Parsing': {
    path: '/echo',
    method: 'POST',
    body: JSON.stringify({ message: 'hello world' }),
    headers: { 'Content-Type': 'application/json' },
  },
};

async function run() {
  let ourServer: ExecaChildProcess | undefined;
  let elysiaServer: ExecaChildProcess | undefined;

  try {
    console.log('Finding available ports...');
    const ourPort = await getPort();
    const elysiaPort = await getPort();

    console.log(`Starting Our Server on port ${ourPort}...`);
    ourServer = execa('bun', ['src/index.ts'], {
      env: { PORT: ourPort.toString() },
      stdio: 'pipe',
    });

    console.log(`Starting Elysia Server on port ${elysiaPort}...`);
    elysiaServer = execa('bun', ['benches/elysia.ts'], {
      env: { PORT: elysiaPort.toString() },
      stdio: 'pipe',
    });

    await Promise.all([waitForServer(ourServer), waitForServer(elysiaServer)]);
    console.log('Servers are ready!');

    const ourUrl = `http://localhost:${ourPort}`;
    const elysiaUrl = `http://localhost:${elysiaPort}`;

    for (const [name, config] of Object.entries(scenarios)) {
      console.log(`\n--- Benchmarking: ${name} ---`);

      const ourResult = await autocannon({ url: `${ourUrl}${config.path}`, ...config });
      const elysiaResult = await autocannon({ url: `${elysiaUrl}${config.path}`, ...config });

      const ourReqs = ourResult.requests.average;
      const elysiaReqs = elysiaResult.requests.average;
      const diff = ((ourReqs - elysiaReqs) / elysiaReqs) * 100;

      console.log(`Our Server: ${ourReqs.toFixed(2)} req/s`);
      console.log(`Elysia    : ${elysiaReqs.toFixed(2)} req/s`);
      console.log(`Difference: ${diff.toFixed(2)}% ${diff > 0 ? '(Faster)' : '(Slower)'}`);
    }

  } catch (error) {
    console.error('An error occurred during benchmarking:', error);
  } finally {
    console.log('\nStopping servers...');
    if (ourServer) ourServer.kill();
    if (elysiaServer) elysiaServer.kill();
  }
}

run();
