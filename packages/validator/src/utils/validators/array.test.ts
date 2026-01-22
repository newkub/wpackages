/**
 * Tests for array validators
 */

import { describe, it, expect } from "bun:test";
import { isError } from "../../types";
import * as validators from "./array";

describe("Array Validators", () => {
  describe("arrayNonEmpty", () => {
    it("should validate non-empty arrays", () => {
      const result = validators.arrayNonEmpty()([1, 2, 3]);
      expect(result.success).toBe(true);
    });

    it("should reject non-arrays", () => {
      const result = validators.arrayNonEmpty()("not an array");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be an array");
      }
    });

    it("should reject empty arrays", () => {
      const result = validators.arrayNonEmpty()([]);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Array must not be empty");
      }
    });
  });

  describe("minItems", () => {
    it("should validate minimum items", () => {
      const result = validators.minItems(2)([1, 2, 3]);
      expect(result.success).toBe(true);
    });

    it("should reject non-arrays", () => {
      const result = validators.minItems(2)(null);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be an array");
      }
    });

    it("should reject arrays with too few items", () => {
      const result = validators.minItems(2)([1]);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Minimum 2 items required");
      }
    });
  });

  describe("maxItems", () => {
    it("should validate maximum items", () => {
      const result = validators.maxItems(5)([1, 2, 3]);
      expect(result.success).toBe(true);
    });

    it("should reject non-arrays", () => {
      const result = validators.maxItems(5)({});
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be an array");
      }
    });

    it("should reject arrays with too many items", () => {
      const result = validators.maxItems(2)([1, 2, 3, 4, 5]);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Maximum 2 items allowed");
      }
    });
  });

  describe("exactItems", () => {
    it("should validate exact items", () => {
      const result = validators.exactItems(3)([1, 2, 3]);
      expect(result.success).toBe(true);
    });

    it("should reject non-arrays", () => {
      const result = validators.exactItems(3)("nope");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be an array");
      }
    });

    it("should reject arrays with wrong number of items", () => {
      const result = validators.exactItems(3)([1, 2]);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Array must have exactly 3 items");
      }
    });
  });

  describe("unique", () => {
    it("should validate unique items", () => {
      const result = validators.unique()([1, 2, 3]);
      expect(result.success).toBe(true);
    });

    it("should reject non-arrays", () => {
      const result = validators.unique()(undefined);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be an array");
      }
    });

    it("should reject arrays with duplicate items", () => {
      const result = validators.unique()([1, 2, 2, 3]);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Array must contain unique items");
      }
    });
  });
});
