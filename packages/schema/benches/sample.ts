import { z } from "zod";
import { type } from "arktype";
import * as EffectSchema from "effect/Schema";

import * as w from "../src/index";

export const sampleData = {
  boolean: true,
  string: "hello world",
  number: 42,
  object: { name: "test", age: 30 },
  nested: { user: { id: 1, name: "Alice" }, tags: ["a", "b", "c"] },
  array: [1, 2, 3, 4, 5],
  unionNumber: 42,
  unionString: "42",
} as const;

export const wSchemas = {
  boolean: w.boolean(),
  string: w.string(),
  number: w.number(),
  object: w.object({ name: w.string(), age: w.number() }),
  nested: w.object({
    user: w.object({ id: w.number(), name: w.string() }),
    tags: w.array(w.string()),
  }),
  array: w.array(w.number()),
  union: w.union([w.number(), w.string()]),
};

export const zodSchemas = {
  boolean: z.boolean(),
  string: z.string(),
  number: z.number(),
  object: z.object({ name: z.string(), age: z.number() }),
  nested: z.object({
    user: z.object({ id: z.number(), name: z.string() }),
    tags: z.array(z.string()),
  }),
  array: z.array(z.number()),
  union: z.union([z.number(), z.string()]),
};

export const arktypeSchemas = {
  boolean: type("boolean"),
  string: type("string"),
  number: type("number"),
  object: type({ name: "string", age: "number" }),
  nested: type({
    user: {
      id: "number",
      name: "string",
    },
    tags: "string[]",
  }),
  array: type("number[]"),
  union: type("number | string"),
};

export const effectSchemas = {
  boolean: EffectSchema.Boolean,
  string: EffectSchema.String,
  number: EffectSchema.Number,
  object: EffectSchema.Struct({ name: EffectSchema.String, age: EffectSchema.Number }),
  nested: EffectSchema.Struct({
    user: EffectSchema.Struct({ id: EffectSchema.Number, name: EffectSchema.String }),
    tags: EffectSchema.Array(EffectSchema.String),
  }),
  array: EffectSchema.Array(EffectSchema.Number),
  union: EffectSchema.Union(EffectSchema.Number, EffectSchema.String),
};
