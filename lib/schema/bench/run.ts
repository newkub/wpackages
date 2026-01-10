/**
 * Benchmark Runner
 * Compares @wpackages/schema performance against other schema libraries
 */

import { Bench } from "tinybench";
import {
	simpleStringSchema,
	simpleNumberSchema,
	simpleBooleanSchema,
	userSchema,
	productSchema,
	orderSchema,
	validUser,
	validProduct,
	validOrder,
	invalidUser,
} from "./sample";

// Import other schema libraries
import { z } from "zod";
import * as yup from "yup";
import Joi from "joi";
import * as v from "valibot";

// Define schemas for other libraries
const zodUserSchema = z.object({
	id: z.string().min(36).max(36),
	name: z.string().min(2).max(50),
	email: z.string().email(),
	age: z.number().min(0).max(150),
	isActive: z.boolean().optional(),
});

const yupUserSchema = yup.object({
	id: yup.string().min(36).max(36),
	name: yup.string().min(2).max(50),
	email: yup.string().email(),
	age: yup.number().min(0).max(150),
	isActive: yup.boolean(),
});

const joiUserSchema = Joi.object({
	id: Joi.string().min(36).max(36),
	name: Joi.string().min(2).max(50),
	email: Joi.string().email(),
	age: Joi.number().min(0).max(150),
	isActive: Joi.boolean(),
});

const valibotUserSchema = v.object({
	id: v.string([v.minLength(36), v.maxLength(36)]),
	name: v.string([v.minLength(2), v.maxLength(50)]),
	email: v.string([v.email()]),
	age: v.number([v.minValue(0), v.maxValue(150)]),
	isActive: v.optional(v.boolean()),
});

// Create benchmark
const bench = new Bench({
	time: 1000,
	iterations: 100,
	warmup: true,
	warmupIterations: 10,
});

// Add benchmarks
bench
	.add("@wpackages/schema - simple string", () => {
		simpleStringSchema.parse("hello world");
	})
	.add("@wpackages/schema - simple number", () => {
		simpleNumberSchema.parse(42);
	})
	.add("@wpackages/schema - simple boolean", () => {
		simpleBooleanSchema.parse(true);
	})
	.add("@wpackages/schema - user valid", () => {
		userSchema.parse(validUser);
	})
	.add("@wpackages/schema - user invalid", () => {
		userSchema.parse(invalidUser);
	})
	.add("@wpackages/schema - product", () => {
		productSchema.parse(validProduct);
	})
	.add("@wpackages/schema - order", () => {
		orderSchema.parse(validOrder);
	})
	.add("Zod - user valid", () => {
		zodUserSchema.parse(validUser);
	})
	.add("Zod - user invalid", () => {
		try {
			zodUserSchema.parse(invalidUser);
		} catch {
			// Ignore errors
		}
	})
	.add("Yup - user valid", () => {
		yupUserSchema.validateSync(validUser);
	})
	.add("Yup - user invalid", () => {
		try {
			yupUserSchema.validateSync(invalidUser);
		} catch {
			// Ignore errors
		}
	})
	.add("Joi - user valid", () => {
		joiUserSchema.validate(validUser);
	})
	.add("Joi - user invalid", () => {
		try {
			joiUserSchema.validate(invalidUser);
		} catch {
			// Ignore errors
		}
	})
	.add("Valibot - user valid", () => {
		v.parse(valibotUserSchema, validUser);
	})
	.add("Valibot - user invalid", () => {
		try {
			v.parse(valibotUserSchema, invalidUser);
		} catch {
			// Ignore errors
		}
	});

// Run benchmark
console.log("Running benchmark...");

try {
	await bench.run();
} catch (error) {
	console.error("Benchmark failed:", error);
	process.exit(1);
}

// Display results
const table = bench.table();
console.table(table);

// Save results
const results = bench.tasks.map((task) => ({
	name: task.name,
	ops: task.result?.hz || 0,
	deviation: task.result?.deviation || 0,
	rme: task.result?.rme || 0,
}));

// Sort by ops/sec
results.sort((a, b) => b.ops - a.ops);

// Save to JSON
await Bun.write(
	"bench/result.json",
	JSON.stringify(
		{
			timestamp: new Date().toISOString(),
			results,
			summary: {
				fastest: results[0]?.name || "N/A",
				slowest: results[results.length - 1]?.name || "N/A",
			},
		},
		null,
		2,
	),
);

// Generate HTML report
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Schema Library Benchmark Results</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .summary {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .summary-item {
            display: inline-block;
            margin: 0 20px;
            padding: 10px 20px;
            border-radius: 4px;
        }
        .fastest {
            background: #4caf50;
            color: white;
        }
        .slowest {
            background: #f44336;
            color: white;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #2196f3;
            color: white;
        }
        tr:hover {
            background: #f5f5f5;
        }
        .rank {
            font-weight: bold;
            text-align: center;
        }
        .rank-1 {
            background: #4caf50;
            color: white;
        }
        .rank-2 {
            background: #8bc34a;
            color: white;
        }
        .rank-3 {
            background: #cddc39;
            color: white;
        }
    </style>
</head>
<body>
    <h1>Schema Library Benchmark Results</h1>
    <div class="summary">
        <div class="summary-item fastest">
            <strong>Fastest:</strong> ${results[0]?.name || "N/A"} (${results[0]?.ops?.toFixed(0) || 0} ops/sec)
        </div>
        <div class="summary-item slowest">
            <strong>Slowest:</strong> ${results[results.length - 1]?.name || "N/A"} (${results[results.length - 1]?.ops?.toFixed(0) || 0} ops/sec)
        </div>
    </div>
    <table>
        <thead>
            <tr>
                <th>Rank</th>
                <th>Library</th>
                <th>Operations/sec</th>
                <th>Deviation</th>
                <th>Relative Margin of Error</th>
            </tr>
        </thead>
        <tbody>
            ${results.map((result, index) => `
                <tr>
                    <td class="rank rank-${Math.min(index + 1, 3)}">${index + 1}</td>
                    <td>${result.name}</td>
                    <td>${result.ops.toFixed(0)}</td>
                    <td>${result.deviation.toFixed(2)}</td>
                    <td>${result.rme.toFixed(2)}%</td>
                </tr>
            `).join("")}
        </tbody>
    </table>
    <p style="text-align: center; color: #666; margin-top: 20px;">
        Generated at: ${new Date().toISOString()}
    </p>
</body>
</html>
`;

await Bun.write("bench/result.html", html);

console.log("\nBenchmark results saved to bench/result.json and bench/result.html");
console.log("Open bench/result.html in your browser to view the report");
