import { makeCases } from "./cases";

type BenchResult = {
	readonly name: string;
	readonly iterations: number;
	readonly ms: number;
	readonly nsPerOp: number;
	readonly opsPerSec: number;
};

const now = (): number => performance.now();

const bench = (
	name: string,
	iterations: number,
	fn: () => void,
): BenchResult => {
	const start = now();
	for (let i = 0; i < iterations; i++) fn();
	const ms = now() - start;
	const nsPerOp = (ms * 1_000_000) / iterations;
	const opsPerSec = iterations / (ms / 1000);
	return { name, iterations, ms, nsPerOp, opsPerSec };
};

const format = (r: BenchResult): string => {
	const ops = Number.isFinite(r.opsPerSec) ? r.opsPerSec.toFixed(0) : "0";
	const ns = Number.isFinite(r.nsPerOp) ? r.nsPerOp.toFixed(0) : "0";
	return `${r.name}: ${ops} ops/s (${ns} ns/op) [${r.iterations} iters, ${r.ms.toFixed(1)} ms]`;
};

const main = () => {
	const { UserSchema, StatusSchema, validUser, invalidUser } = makeCases();

	const warmupIters = 20_000;
	const iters = 200_000;

	for (let i = 0; i < warmupIters; i++) {
		UserSchema.parse(validUser);
		UserSchema.parse(invalidUser);
		StatusSchema.parse("ok");
		StatusSchema.parse(-1);
	}

	const results: BenchResult[] = [];
	results.push(
		bench("schema.object.parse(valid)", iters, () => {
			UserSchema.parse(validUser);
		}),
	);
	results.push(
		bench("schema.object.parse(invalid)", iters, () => {
			UserSchema.parse(invalidUser);
		}),
	);
	results.push(
		bench("schema.union.parse(valid)", iters, () => {
			StatusSchema.parse("ok");
		}),
	);
	results.push(
		bench("schema.union.parse(invalid)", iters, () => {
			StatusSchema.parse(-1);
		}),
	);

	for (const r of results) {
		console.log(format(r));
	}
};

main();
