import { Context, Effect, Layer } from "effect";
import type { Pool } from "pg";
import { createDb, createPool } from "../client";

// Define the service interface
export interface Database {
	readonly db: ReturnType<typeof createDb>;
	readonly pool: Pool;
}

// Create a Tag for the service
export const Database = Context.GenericTag<Database>("Database");

// Implement the live service layer
export const DatabaseLive = (connectionString: string) =>
	Layer.scoped(
		Database,
		Effect.acquireRelease(
			Effect.sync(() => {
				const pool = createPool(connectionString);
				const db = createDb(pool);
				return Database.of({ db, pool });
			}),
			({ pool }) => Effect.orDie(Effect.tryPromise(() => pool.end())),
		),
	);
