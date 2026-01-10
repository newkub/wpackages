/**
 * Schema Cache
 * Provides caching mechanisms for compiled schemas and validation results.
 */

import type { Schema, Result } from "../types";

interface CacheEntry<T> {
	result: Result<T>;
	timestamp: number;
}

interface CacheConfig {
	maxSize?: number;
	ttl?: number;
}

const DEFAULT_CACHE_CONFIG: Required<CacheConfig> = {
	maxSize: 1000,
	ttl: 60000,
};

class SchemaCache<T> {
	private cache = new Map<string, CacheEntry<T>>();
	private config: Required<CacheConfig>;

	constructor(config: CacheConfig = {}) {
		this.config = { ...DEFAULT_CACHE_CONFIG, ...config };
	}

	get(key: string): Result<T> | undefined {
		const entry = this.cache.get(key);
		if (!entry) {
			return undefined;
		}

		const now = Date.now();
		if (now - entry.timestamp > this.config.ttl) {
			this.cache.delete(key);
			return undefined;
		}

		return entry.result;
	}

	set(key: string, result: Result<T>): void {
		if (this.cache.size >= this.config.maxSize) {
			const firstKey = this.cache.keys().next().value;
			if (firstKey) {
				this.cache.delete(firstKey);
			}
		}

		this.cache.set(key, {
			result,
			timestamp: Date.now(),
		});
	}

	clear(): void {
		this.cache.clear();
	}

	size(): number {
		return this.cache.size;
	}

	cleanup(): void {
		const now = Date.now();
		for (const [key, entry] of this.cache.entries()) {
			if (now - entry.timestamp > this.config.ttl) {
				this.cache.delete(key);
			}
		}
	}
}

const globalCache = new SchemaCache<any>();

export function getCache<T>(key: string): Result<T> | undefined {
	return globalCache.get(key);
}

export function setCache<T>(key: string, result: Result<T>): void {
	globalCache.set(key, result);
}

export function clearCache(): void {
	globalCache.clear();
}

export function getCacheSize(): number {
	return globalCache.size();
}

export function cleanupCache(): void {
	globalCache.cleanup();
}

export function createCache<T>(config?: CacheConfig): SchemaCache<T> {
	return new SchemaCache<T>(config);
}

export function withCache<T>(
	schema: Schema<unknown, T>,
	cacheKey: (input: unknown) => string,
): Schema<unknown, T> {
	return {
		...schema,
		parse(input: unknown): Result<T> {
			const key = cacheKey(input);
			const cached = getCache<T>(key);

			if (cached) {
				return cached;
			}

			const result = schema.parse(input);
			setCache(key, result);
			return result;
		},
		_metadata: schema._metadata,
		_input: schema._input,
		_output: schema._output,
	} as Schema<unknown, T>;
}
