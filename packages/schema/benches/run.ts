import * as Schema from "effect/Schema";

import { arktypeSchemas, effectSchemas, sampleData, wSchemas, zodSchemas } from "./sample";

const ITERATIONS = 200_000;

function benchmark(name: string, fn: () => void) {
	const start = performance.now();
	for (let i = 0; i < ITERATIONS; i++) {
		fn();
	}
	const end = performance.now();
	const duration = end - start;
	const opsPerSec = (ITERATIONS / duration) * 1000;

	return {
		name,
		duration,
		opsPerSec,
		iterations: ITERATIONS,
	};
}

function runBenchmarks() {
	const results: Array<{ name: string; duration: number; opsPerSec: number; iterations: number }> = [];

	results.push(
		benchmark("w-boolean", () => {
			wSchemas.boolean.parse(sampleData.boolean);
		}),
	);

	results.push(
		benchmark("w-string", () => {
			wSchemas.string.parse(sampleData.string);
		}),
	);

	results.push(
		benchmark("w-number", () => {
			wSchemas.number.parse(sampleData.number);
		}),
	);

	results.push(
		benchmark("w-object", () => {
			wSchemas.object.parse(sampleData.object);
		}),
	);

	results.push(
		benchmark("w-nested", () => {
			wSchemas.nested.parse(sampleData.nested);
		}),
	);

	results.push(
		benchmark("w-array", () => {
			wSchemas.array.parse(sampleData.array);
		}),
	);

	results.push(
		benchmark("w-union-number", () => {
			wSchemas.union.parse(sampleData.unionNumber);
		}),
	);

	results.push(
		benchmark("w-union-string", () => {
			wSchemas.union.parse(sampleData.unionString);
		}),
	);

	results.push(
		benchmark("zod-boolean", () => {
			zodSchemas.boolean.parse(sampleData.boolean);
		}),
	);

	results.push(
		benchmark("zod-string", () => {
			zodSchemas.string.parse(sampleData.string);
		}),
	);

	results.push(
		benchmark("zod-number", () => {
			zodSchemas.number.parse(sampleData.number);
		}),
	);

	results.push(
		benchmark("zod-object", () => {
			zodSchemas.object.parse(sampleData.object);
		}),
	);

	results.push(
		benchmark("zod-nested", () => {
			zodSchemas.nested.parse(sampleData.nested);
		}),
	);

	results.push(
		benchmark("zod-array", () => {
			zodSchemas.array.parse(sampleData.array);
		}),
	);

	results.push(
		benchmark("zod-union-number", () => {
			zodSchemas.union.parse(sampleData.unionNumber);
		}),
	);

	results.push(
		benchmark("zod-union-string", () => {
			zodSchemas.union.parse(sampleData.unionString);
		}),
	);

	results.push(
		benchmark("arktype-boolean", () => {
			arktypeSchemas.boolean(sampleData.boolean);
		}),
	);

	results.push(
		benchmark("arktype-string", () => {
			arktypeSchemas.string(sampleData.string);
		}),
	);

	results.push(
		benchmark("arktype-number", () => {
			arktypeSchemas.number(sampleData.number);
		}),
	);

	results.push(
		benchmark("arktype-object", () => {
			arktypeSchemas.object(sampleData.object);
		}),
	);

	results.push(
		benchmark("arktype-nested", () => {
			arktypeSchemas.nested(sampleData.nested);
		}),
	);

	results.push(
		benchmark("arktype-array", () => {
			arktypeSchemas.array(sampleData.array);
		}),
	);

	results.push(
		benchmark("arktype-union-number", () => {
			arktypeSchemas.union(sampleData.unionNumber);
		}),
	);

	results.push(
		benchmark("arktype-union-string", () => {
			arktypeSchemas.union(sampleData.unionString);
		}),
	);

	results.push(
		benchmark("effect-boolean", () => {
			Schema.decodeUnknownSync(effectSchemas.boolean)(sampleData.boolean);
		}),
	);

	results.push(
		benchmark("effect-string", () => {
			Schema.decodeUnknownSync(effectSchemas.string)(sampleData.string);
		}),
	);

	results.push(
		benchmark("effect-number", () => {
			Schema.decodeUnknownSync(effectSchemas.number)(sampleData.number);
		}),
	);

	results.push(
		benchmark("effect-object", () => {
			Schema.decodeUnknownSync(effectSchemas.object)(sampleData.object);
		}),
	);

	results.push(
		benchmark("effect-nested", () => {
			Schema.decodeUnknownSync(effectSchemas.nested)(sampleData.nested);
		}),
	);

	results.push(
		benchmark("effect-array", () => {
			Schema.decodeUnknownSync(effectSchemas.array)(sampleData.array);
		}),
	);

	results.push(
		benchmark("effect-union-number", () => {
			Schema.decodeUnknownSync(effectSchemas.union)(sampleData.unionNumber);
		}),
	);

	results.push(
		benchmark("effect-union-string", () => {
			Schema.decodeUnknownSync(effectSchemas.union)(sampleData.unionString);
		}),
	);

	results.sort((a, b) => b.opsPerSec - a.opsPerSec);
	return results;
}

const results = runBenchmarks();

console.log("Benchmark Results:");
console.log("==================");
results.forEach((result, index) => {
	console.log(
		`${index + 1}. ${result.name}: ${result.opsPerSec.toFixed(2)} ops/sec (${
			result.duration.toFixed(
				2,
			)
		}ms for ${result.iterations} iterations)`,
	);
});

const resultJson = {
	timestamp: new Date().toISOString(),
	iterations: ITERATIONS,
	results,
};

async function main() {
	await Bun.write(new URL("./result.json", import.meta.url), JSON.stringify(resultJson, null, 2));
	console.log("\nResults saved to benches/result.json");
}

void main();
