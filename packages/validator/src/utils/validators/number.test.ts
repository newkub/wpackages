/**
 * Tests for number validators
 */

import { describe, it, expect } from "bun:test";
import { isError } from "../../types";
import * as validators from "./number";

describe("Number Validators", () => {
  describe("min", () => {
    it("should validate minimum value", () => {
      const result = validators.min(5)(10);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(10);
      }
    });

    it("should reject value below minimum", () => {
      const result = validators.min(5)(3);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Minimum value is 5");
      }
    });
  });

  describe("max", () => {
    it("should validate maximum value", () => {
      const result = validators.max(10)(5);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(5);
      }
    });

    it("should reject value above maximum", () => {
      const result = validators.max(10)(15);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Maximum value is 10");
      }
    });
  });

  describe("positive", () => {
    it("should validate positive numbers", () => {
      const result = validators.positive()(5);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(5);
      }
    });

    it("should reject non-positive numbers", () => {
      const result = validators.positive()(-5);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be positive");
      }
    });
  });

  describe("negative", () => {
    it("should validate negative numbers", () => {
      const result = validators.negative()(-5);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(-5);
      }
    });

    it("should reject non-negative numbers", () => {
      const result = validators.negative()(5);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be negative");
      }
    });
  });

  describe("integer", () => {
    it("should validate integers", () => {
      const result = validators.integer()(5);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(5);
      }
    });

    it("should reject non-integers", () => {
      const result = validators.integer()(5.5);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be an integer");
      }
    });
  });

  describe("range", () => {
    it("should validate range", () => {
      const result = validators.range(0, 100)(50);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(50);
      }
    });

    it("should reject value below range", () => {
      const result = validators.range(0, 100)(-10);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be between 0 and 100");
      }
    });

    it("should reject value above range", () => {
      const result = validators.range(0, 100)(150);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be between 0 and 100");
      }
    });
  });
});
