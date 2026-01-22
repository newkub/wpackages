/**
 * Tests for function validators
 */

import { describe, it, expect } from "bun:test";
import { isError } from "../../types";
import * as validators from "./function";

describe("Function Validators", () => {
  describe("func", () => {
    it("should validate functions", () => {
      const result = validators.func()(() => {});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data).toBe("function");
      }
    });

    it("should reject non-functions", () => {
      const result = validators.func()("not a function");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a function");
      }
    });
  });

  describe("arity", () => {
    it("should validate function arity", () => {
      const result = validators.arity(2)((a, b) => a + b);
      expect(result.success).toBe(true);
    });

    it("should reject wrong arity", () => {
      const result = validators.arity(2)((a) => a);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Function must have 2 parameters");
      }
    });
  });
});
