import autocannon from "autocannon";

export interface BenchmarkConfig {
  framework: string;
  url: string;
  connections: number;
  pipelining: number;
  duration: number;
}

export interface BenchmarkResult {
  framework: string;
  scenario: string;
  latency: {
    p50: number;
    p95: number | null;
    p99: number;
  };
  throughput: number;
  memory: number;
}

export async function runBenchmark(config: BenchmarkConfig): Promise<BenchmarkResult> {
  const scenario = config.url.split("/").pop() || "unknown";
  
  return new Promise((resolve, reject) => {
    autocannon(
      {
        url: config.url,
        connections: config.connections,
        pipelining: config.pipelining,
        duration: config.duration,
        amount: undefined,
        method: config.url.includes("data") && scenario === "data" ? "POST" : "GET",
        body: config.url.includes("data") && scenario === "data" ? JSON.stringify({ test: "data" }) : undefined,
        headers: {
          "content-type": "application/json",
        },
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve({
          framework: config.framework,
          scenario,
          latency: {
            p50: result.latency.mean / 1000, // Convert to ms
            p95: result.latency.p95 / 1000,
            p99: result.latency.p99 / 1000,
          },
          throughput: result.requests.mean,
          memory: 0, // Memory tracking can be added later
        });
      }
    );
  });
}
