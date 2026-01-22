/**
 * Tests for custom validators
 */

import { describe, it, expect } from "bun:test";
import { isError } from "../../types";
import * as validators from "./custom";

describe("Custom Validators", () => {
  describe("custom", () => {
    it("should validate with custom function", () => {
      const result = validators.custom((value) => typeof value === "string" && value.length > 0)("hello");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("hello");
      }
    });

    it("should reject with custom function", () => {
      const result = validators.custom((value) => typeof value === "string" && value.length > 0)("");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Custom validation failed");
      }
    });
  });

  describe("oneOf", () => {
    it("should validate enum values", () => {
      const result = validators.oneOf(["a", "b", "c"] as const)("b");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("b");
      }
    });

    it("should reject values not in enum", () => {
      const result = validators.oneOf(["a", "b", "c"] as const)("d" as unknown);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toContain("Value must be one of");
      }
    });
  });

  describe("notOneOf", () => {
    it("should validate values not in enum", () => {
      const result = validators.notOneOf(["a", "b", "c"] as const)("d" as unknown);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeDefined();
      }
    });

    it("should reject values in enum", () => {
      const result = validators.notOneOf(["a", "b", "c"] as const)("b");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toContain("Value must not be one of");
      }
    });
  });

  describe("matches", () => {
    it("should validate exact match", () => {
      const result = validators.matches("hello")("hello");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("hello");
      }
    });

    it("should reject non-matching values", () => {
      const result = validators.matches("hello")("world");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe('Value must be "hello"');
      }
    });
  });

  describe("required", () => {
    it("should validate required values", () => {
      const result = validators.required()("hello");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("hello");
      }
    });

    it("should reject undefined", () => {
      const result = validators.required()(undefined);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value is required");
      }
    });

    it("should reject null", () => {
      const result = validators.required()(null);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value is required");
      }
    });
  });

  describe("optional", () => {
    it("should validate optional values", () => {
      const stringValidator = (value: unknown) =>
        typeof value === "string"
          ? ({ success: true, data: value } as const)
          : ({ success: false, error: { path: [], message: "Invalid", code: "invalid" } } as const);

      const result = validators.optional(stringValidator)(undefined);
      expect(result.success).toBe(true);
    });

    it("should pass through defined values", () => {
      const stringValidator = (value: unknown) =>
        typeof value === "string"
          ? ({ success: true, data: value } as const)
          : ({ success: false, error: { path: [], message: "Invalid", code: "invalid" } } as const);

      const result = validators.optional(stringValidator)("hello");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("hello");
      }
    });
  });

  describe("nullable", () => {
    it("should validate nullable values", () => {
      const stringValidator = (value: unknown) =>
        typeof value === "string"
          ? ({ success: true, data: value } as const)
          : ({ success: false, error: { path: [], message: "Invalid", code: "invalid" } } as const);

      const result = validators.nullable(stringValidator)(null);
      expect(result.success).toBe(true);
    });

    it("should pass through non-null values", () => {
      const stringValidator = (value: unknown) =>
        typeof value === "string"
          ? ({ success: true, data: value } as const)
          : ({ success: false, error: { path: [], message: "Invalid", code: "invalid" } } as const);

      const result = validators.nullable(stringValidator)("hello");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("hello");
      }
    });
  });
});
