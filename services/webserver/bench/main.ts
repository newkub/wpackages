import { runBenchmark } from "./benchmark";
import { sampleConfigs, baselineResults, competitorData } from "./sample";
import { generateHTMLReport } from "./html-report";
import { BenchmarkRun } from "./types";
import { formatThroughput, formatLatency, getImprovementEmoji } from "./formatters";
import { writeFileSync } from "fs";
import { spawn } from "child_process";

// Libraries and algorithms used
const USED_LIBRARIES = [
  "Bun.serve (native)",
  "Bun Runtime",
  "TypeScript",
];

const USED_ALGORITHMS = [
  "Pre-allocated Response",
  "Direct Route Matching",
  "Map-based Routing",
  "Zero-copy JSON",
];

async function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return;
      }
    } catch {
      // ignore
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error(`Server did not become ready within ${timeoutMs}ms: ${url}`);
}

export async function runBenchmarkSuite(): Promise<void> {
  console.log("🚀 Starting webserver benchmark...\n");

  // Display libraries and algorithms used
  console.log("📦 Libraries & Algorithms Used:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Libraries:");
  USED_LIBRARIES.forEach((lib) => console.log(`  • ${lib}`));
  console.log("\nAlgorithms:");
  USED_ALGORITHMS.forEach((algo) => console.log(`  • ${algo}`));
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Start server
  console.log("📡 Starting benchmark server...");
  const serverProc = spawn(
    process.platform === "win32" ? "bun.exe" : "bun",
    ["run", "bench/server-fast.ts"],
    {
      stdio: "inherit",
    }
  );

  // Wait for server to be ready
  await waitForServer("http://localhost:3000/health", 10000);
  console.log("✅ Server is ready\n");

  const results = [];

  try {
    for (const config of sampleConfigs) {
      console.log(`📊 Running: ${config.url}`);
      try {
        const result = await runBenchmark(config);
        results.push(result);

        const scenario = config.url.split("/").pop() || "unknown";
        const baseline = baselineResults[scenario as keyof typeof baselineResults];

        if (baseline) {
          const improvement = {
            latency: {
              p50: ((baseline.latency.p50 - result.latency.p50) / baseline.latency.p50 * 100).toFixed(1),
              p95: ((baseline.latency.p95 - result.latency.p95) / baseline.latency.p95 * 100).toFixed(1),
              p99: ((baseline.latency.p99 - result.latency.p99) / baseline.latency.p99 * 100).toFixed(1),
            },
            throughput: ((result.throughput - baseline.throughput) / baseline.throughput * 100).toFixed(1),
          };

          console.log(`\n   📈 Results:`);
          console.log(`   ──────────────────────────────────────────────`);
          console.log(`   Latency P50:   ${formatLatency(result.latency.p50)} ${getImprovementEmoji(parseFloat(improvement.latency.p50))} ${improvement.latency.p50}%`);
          console.log(`   Throughput:    ${formatThroughput(result.throughput)} ${getImprovementEmoji(parseFloat(improvement.throughput))} ${improvement.throughput}%`);
        }
      } catch (error) {
        console.error(`❌ Failed to run benchmark for ${config.url}:`, error);
      }
      console.log();
    }
  } finally {
    console.log("🛑 Stopping server...");
    serverProc.kill();
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Display comparison table
  console.log("\n🏆 Competitor Comparison:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("┌─────────────────────┬──────────────────┬──────────────┐");
  console.log("│ Framework           │ Throughput      │ Latency      │");
  console.log("├─────────────────────┼──────────────────┼──────────────┤");

  // Add competitors
  Object.entries(competitorData).forEach(([name, data]: [string, any]) => {
    console.log(`│ ${name.padEnd(19)} │ ${formatThroughput(data.throughput).padEnd(14)} │ ${formatLatency(data.latency).padEnd(12)} │`);
  });

  // Add our results
  const avgThroughput = results.reduce((sum, r) => sum + r.throughput, 0) / results.length;
  const avgLatency = results.reduce((sum, r) => sum + r.latency.p50, 0) / results.length;
  console.log(`│ ${"WebServer (Ours)".padEnd(19)} │ ${formatThroughput(avgThroughput).padEnd(14)} │ ${formatLatency(avgLatency).padEnd(12)} │`);
  console.log("└─────────────────────┴──────────────────┴──────────────┘");

  // Calculate win/loss
  const competitors = Object.entries(competitorData);
  const wins = competitors.filter(([_, data]: [string, any]) => avgThroughput > data.throughput).length;
  const losses = competitors.length - wins;

  console.log(`\n📊 Performance Summary:`);
  console.log(`   Average Throughput: ${formatThroughput(avgThroughput)}`);
  console.log(`   Average Latency:   ${formatLatency(avgLatency)}`);
  console.log(`   vs Competitors:    ${wins} wins, ${losses} losses`);

  if (wins > losses) {
    console.log(`   🎯 Status: WINNER! 🏆`);
  } else if (wins === losses) {
    console.log(`   🎯 Status: TIED 🤝`);
  } else {
    console.log(`   🎯 Status: NEEDS IMPROVEMENT ⚠️`);
  }
  console.log();

  const runData: BenchmarkRun = {
    timestamp: new Date().toISOString(),
    results,
    comparison: results.map(r => ({
      scenario: r.scenario,
      throughput: r.throughput,
      latency: r.latency,
    })),
    competitors: competitorData,
    libraries: USED_LIBRARIES,
    algorithms: USED_ALGORITHMS,
  };

  // Save results
  writeFileSync("./bench/result.json", JSON.stringify(runData, null, 2));
  console.log("💾 Results saved to ./bench/result.json");

  // Generate HTML report
  generateHTMLReport(runData);
  console.log("📄 HTML report generated: ./bench/result.html\n");
}
