/**
 * Tests for numeric validators
 */

import { describe, it, expect } from "bun:test";
import { isError } from "../../types";
import * as validators from "./numeric";

describe("Numeric Validators", () => {
  describe("numeric", () => {
    it("should validate numbers", () => {
      const result = validators.numeric()(123);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(123);
      }
    });

    it("should validate numeric strings", () => {
      const result = validators.numeric()("123");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("123");
      }
    });

    it("should reject non-numeric values", () => {
      const result = validators.numeric()("abc");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be numeric");
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

    it("should reject floats", () => {
      const result = validators.integer()(5.5);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be an integer");
      }
    });

    it("should reject non-numbers", () => {
      const result = validators.integer()("5");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be an integer");
      }
    });
  });

  describe("float", () => {
    it("should validate numbers", () => {
      const result = validators.float()(5.5);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(5.5);
      }
    });

    it("should reject NaN", () => {
      const result = validators.float()(Number.NaN);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a number");
      }
    });

    it("should reject non-numbers", () => {
      const result = validators.float()("5.5");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a number");
      }
    });
  });

  describe("even", () => {
    it("should validate even numbers", () => {
      const result = validators.even()(4);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(4);
      }
    });

    it("should reject non-integers", () => {
      const result = validators.even()(4.5);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be an integer");
      }
    });

    it("should reject non-numbers", () => {
      const result = validators.even()("4");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be an integer");
      }
    });

    it("should reject odd numbers", () => {
      const result = validators.even()(5);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be even");
      }
    });
  });

  describe("odd", () => {
    it("should validate odd numbers", () => {
      const result = validators.odd()(5);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(5);
      }
    });

    it("should reject non-integers", () => {
      const result = validators.odd()(5.5);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be an integer");
      }
    });

    it("should reject non-numbers", () => {
      const result = validators.odd()("5");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be an integer");
      }
    });

    it("should reject even numbers", () => {
      const result = validators.odd()(4);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be odd");
      }
    });
  });

  describe("divisibleBy", () => {
    it("should validate divisible numbers", () => {
      const result = validators.divisibleBy(3)(6);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(6);
      }
    });

    it("should reject non-numbers", () => {
      const result = validators.divisibleBy(3)("6");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a number");
      }
    });

    it("should reject divisor zero", () => {
      const result = validators.divisibleBy(0)(6);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Divisor cannot be zero");
      }
    });

    it("should reject non-divisible numbers", () => {
      const result = validators.divisibleBy(3)(7);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be divisible by 3");
      }
    });
  });

  describe("finite", () => {
    it("should validate finite numbers", () => {
      const result = validators.finite()(123);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(123);
      }
    });

    it("should reject infinity", () => {
      const result = validators.finite()(Infinity);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a finite number");
      }
    });
  });

  describe("safeInteger", () => {
    it("should validate safe integers", () => {
      const result = validators.safeInteger()(123);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(123);
      }
    });

    it("should reject unsafe integers", () => {
      const result = validators.safeInteger()(Number.MAX_SAFE_INTEGER + 1);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a safe integer");
      }
    });
  });
});
