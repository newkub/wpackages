/**
 * Tests for collection validators
 */

import { describe, it, expect } from "bun:test";
import { isError } from "../../types";
import * as validators from "./collection";

describe("Collection Validators", () => {
  describe("array", () => {
    it("should validate arrays", () => {
      const result = validators.array()([1, 2, 3]);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([1, 2, 3]);
      }
    });

    it("should validate arrays with itemValidator", () => {
      const itemValidator = (value: unknown) =>
        typeof value === "number"
          ? ({ success: true, data: value } as const)
          : ({ success: false, error: { path: [], message: "Invalid item", code: "invalid" } } as const);

      const result = validators.array(itemValidator)([1, 2, 3]);
      expect(result.success).toBe(true);
    });

    it("should reject arrays when itemValidator fails", () => {
      const itemValidator = (value: unknown) =>
        typeof value === "number"
          ? ({ success: true, data: value } as const)
          : ({ success: false, error: { path: [], message: "Invalid item", code: "invalid" } } as const);

      const result = validators.array(itemValidator)([1, "x", 3]);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toContain("Array item at index 1 is invalid");
      }
    });

    it("should reject non-arrays", () => {
      const result = validators.array()("not an array");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be an array");
      }
    });
  });

  describe("set", () => {
    it("should validate sets", () => {
      const result = validators.set()(new Set([1, 2, 3]));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(new Set([1, 2, 3]));
      }
    });

    it("should validate sets with itemValidator", () => {
      const itemValidator = (value: unknown) =>
        typeof value === "number"
          ? ({ success: true, data: value } as const)
          : ({ success: false, error: { path: [], message: "Invalid item", code: "invalid" } } as const);

      const result = validators.set(itemValidator)(new Set([1, 2, 3]));
      expect(result.success).toBe(true);
    });

    it("should reject sets when itemValidator fails", () => {
      const itemValidator = (value: unknown) =>
        typeof value === "number"
          ? ({ success: true, data: value } as const)
          : ({ success: false, error: { path: [], message: "Invalid item", code: "invalid" } } as const);

      const result = validators.set(itemValidator)(new Set([1, "x", 3]));
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toContain("Set item at index");
      }
    });

    it("should reject non-sets", () => {
      const result = validators.set()([1, 2, 3]);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a Set");
      }
    });
  });

  describe("map", () => {
    it("should validate maps", () => {
      const result = validators.map()(new Map([["key", "value"]]));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(new Map([["key", "value"]]));
      }
    });

    it("should reject map when keyValidator fails", () => {
      const keyValidator = (value: unknown) =>
        typeof value === "string"
          ? ({ success: true, data: value } as const)
          : ({ success: false, error: { path: [], message: "Invalid key", code: "invalid" } } as const);

      const result = validators.map(keyValidator)(new Map([[123 as unknown as string, "value"]]));
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toContain("Map key is invalid");
      }
    });

    it("should reject map when valueValidator fails", () => {
      const valueValidator = (value: unknown) =>
        typeof value === "string"
          ? ({ success: true, data: value } as const)
          : ({ success: false, error: { path: [], message: "Invalid value", code: "invalid" } } as const);

      const result = validators.map(undefined, valueValidator)(new Map([["key", 123 as unknown as string]]));
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toContain("Map value for key");
      }
    });

    it("should reject non-maps", () => {
      const result = validators.map()({ key: "value" });
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a Map");
      }
    });
  });

  describe("nonEmpty", () => {
    it("should validate non-empty arrays", () => {
      const result = validators.nonEmpty()([1, 2, 3]);
      expect(result.success).toBe(true);
    });

    it("should validate non-empty sets", () => {
      const result = validators.nonEmpty()(new Set([1]));
      expect(result.success).toBe(true);
    });

    it("should validate non-empty maps", () => {
      const result = validators.nonEmpty()(new Map([["k", "v"]]));
      expect(result.success).toBe(true);
    });

    it("should reject non-collections", () => {
      const result = validators.nonEmpty()(123);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a collection");
      }
    });

    it("should reject empty arrays", () => {
      const result = validators.nonEmpty()([]);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Array must not be empty");
      }
    });

    it("should reject empty sets", () => {
      const result = validators.nonEmpty()(new Set());
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Set must not be empty");
      }
    });

    it("should reject empty maps", () => {
      const result = validators.nonEmpty()(new Map());
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Map must not be empty");
      }
    });
  });

  describe("size", () => {
    it("should validate exact size", () => {
      const result = validators.size(3)([1, 2, 3]);
      expect(result.success).toBe(true);
    });

    it("should reject non-collections", () => {
      const result = validators.size(3)("nope");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a collection");
      }
    });

    it("should reject wrong size", () => {
      const result = validators.size(3)([1, 2]);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Collection must have exactly 3 items");
      }
    });
  });

  describe("minSize", () => {
    it("should validate minimum size", () => {
      const result = validators.minSize(2)([1, 2, 3]);
      expect(result.success).toBe(true);
    });

    it("should reject when below minimum size", () => {
      const result = validators.minSize(2)([1]);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Collection must have at least 2 items");
      }
    });
  });

  describe("maxSize", () => {
    it("should validate maximum size", () => {
      const result = validators.maxSize(3)([1, 2, 3]);
      expect(result.success).toBe(true);
    });

    it("should reject when above maximum size", () => {
      const result = validators.maxSize(2)([1, 2, 3]);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Collection must have at most 2 items");
      }
    });
  });

  describe("includes", () => {
    it("should validate included items", () => {
      const result = validators.includes(2)([1, 2, 3]);
      expect(result.success).toBe(true);
    });

    it("should validate included items in Set", () => {
      const result = validators.includes(2)(new Set([1, 2, 3]));
      expect(result.success).toBe(true);
    });

    it("should reject invalid type", () => {
      const result = validators.includes(2)(123);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be an array or Set");
      }
    });

    it("should reject missing items", () => {
      const result = validators.includes(4)([1, 2, 3]);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toContain("Array must include");
      }
    });
  });

  describe("excludes", () => {
    it("should validate excluded items", () => {
      const result = validators.excludes(4)([1, 2, 3]);
      expect(result.success).toBe(true);
    });

    it("should reject when array includes item", () => {
      const result = validators.excludes(2)([1, 2, 3]);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toContain("Array must not include");
      }
    });

    it("should validate excluded items in Set", () => {
      const result = validators.excludes(4)(new Set([1, 2, 3]));
      expect(result.success).toBe(true);
    });

    it("should reject when set includes item", () => {
      const result = validators.excludes(2)(new Set([1, 2, 3]));
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toContain("Set must not include");
      }
    });

    it("should reject invalid type", () => {
      const result = validators.excludes(2)("nope");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be an array or Set");
      }
    });
  });
});
