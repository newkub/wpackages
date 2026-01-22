/**
 * Tests for boolean validators
 */

import { describe, it, expect } from "bun:test";
import { isError } from "../../types";
import * as validators from "./boolean";

describe("Boolean Validators", () => {
  describe("boolean", () => {
    it("should validate boolean values", () => {
      const result = validators.boolean()(true);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(true);
      }
    });

    it("should reject non-boolean values", () => {
      const result = validators.boolean()("true");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a boolean");
      }
    });
  });

  describe("trueValue", () => {
    it("should validate true", () => {
      const result = validators.trueValue()(true);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(true);
      }
    });

    it("should reject false", () => {
      const result = validators.trueValue()(false);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be true");
      }
    });
  });

  describe("falseValue", () => {
    it("should validate false", () => {
      const result = validators.falseValue()(false);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(false);
      }
    });

    it("should reject true", () => {
      const result = validators.falseValue()(true);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be false");
      }
    });
  });

  describe("truthy", () => {
    it("should validate truthy values", () => {
      const result = validators.truthy()(1);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(1);
      }
    });

    it("should reject falsy values", () => {
      const result = validators.truthy()(0);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be truthy");
      }
    });
  });

  describe("falsy", () => {
    it("should validate falsy values", () => {
      const result = validators.falsy()(0);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(0);
      }
    });

    it("should reject truthy values", () => {
      const result = validators.falsy()(1);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be falsy");
      }
    });
  });
});
