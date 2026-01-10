/**
 * Sample Schemas for Benchmark
 * Defines common schemas used for performance testing
 */

import { string, number, boolean, object, array, union, literal } from "../src";

// Simple schemas
export const simpleStringSchema = string({ min: 2, max: 50 });
export const simpleNumberSchema = number({ min: 0, max: 100 });
export const simpleBooleanSchema = boolean();

// Complex schemas
export const userSchema = object({
	shape: {
		id: string({ min: 36, max: 36 }),
		name: string({ min: 2, max: 50 }),
		email: string({ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
		age: number({ min: 0, max: 150 }),
		isActive: boolean().optional(),
	},
});

export const productSchema = object({
	shape: {
		id: string({ min: 36, max: 36 }),
		name: string({ min: 2, max: 100 }),
		price: number({ min: 0 }),
		tags: array({ item: string({ min: 1, max: 20 }) }),
		inStock: boolean(),
	},
});

export const orderSchema = object({
	shape: {
		id: string({ min: 36, max: 36 }),
		items: array({
			item: object({
				shape: {
					productId: string({ min: 36, max: 36 }),
					quantity: number({ min: 1, max: 100 }),
					price: number({ min: 0 }),
				},
			}),
		}),
		total: number({ min: 0 }),
		status: union([
			literal("pending"),
			literal("processing"),
			literal("shipped"),
			literal("delivered"),
			literal("cancelled"),
		]),
	},
});

// Sample data for validation
export const validUser = {
	id: "550e8400-e29b-41d4-a716-446655440000",
	name: "John Doe",
	email: "john@example.com",
	age: 30,
	isActive: true,
};

export const validProduct = {
	id: "550e8400-e29b-41d4-a716-446655440001",
	name: "Sample Product",
	price: 99.99,
	tags: ["tag1", "tag2", "tag3"],
	inStock: true,
};

export const validOrder = {
	id: "550e8400-e29b-41d4-a716-446655440002",
	items: [
		{
			productId: "550e8400-e29b-41d4-a716-446655440001",
			quantity: 2,
			price: 99.99,
		},
		{
			productId: "550e8400-e29b-41d4-a716-446655440003",
			quantity: 1,
			price: 49.99,
		},
	],
	total: 249.97,
	status: "pending",
};

export const invalidUser = {
	id: "invalid-id",
	name: "J",
	email: "not-an-email",
	age: -5,
	isActive: "yes",
};
