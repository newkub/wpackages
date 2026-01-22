/**
 * Tests for object validators
 */

import { describe, it, expect } from "bun:test";
import { isError } from "../../types";
import * as validators from "./object";

describe("Object Validators", () => {
  describe("hasKey", () => {
    it("should validate object has key", () => {
      const obj = { name: "John" };
      const result = validators.hasKey("name")(obj);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(obj);
      }
    });

    it("should reject object without key", () => {
      const obj = { age: 30 };
      const result = validators.hasKey("name")(obj);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe('Object must have key "name"');
      }
    });
  });

  describe("requiredKeys", () => {
    it("should validate object has required keys", () => {
      const obj = { name: "John", age: 30 };
      const result = validators.requiredKeys("name", "age")(obj);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(obj);
      }
    });

    it("should reject object missing required keys", () => {
      const obj = { name: "John" };
      const result = validators.requiredKeys("name", "age")(obj);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Object must have keys: age");
      }
    });
  });

  describe("shape", () => {
    it("should validate object shape", () => {
      const obj = { name: "John", age: 30 };
      const result = validators.shape({
        name: (value) =>
          typeof value === "string"
            ? ({ success: true, data: value } as const)
            : ({ success: false, error: { path: [], message: "Invalid name", code: "invalid" } } as const),
        age: (value) =>
          typeof value === "number"
            ? ({ success: true, data: value } as const)
            : ({ success: false, error: { path: [], message: "Invalid age", code: "invalid" } } as const),
      })(obj);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(obj);
      }
    });

    it("should reject invalid object shape", () => {
      const obj = { name: "John", age: "30" };
      const result = validators.shape({
        name: (value) =>
          typeof value === "string"
            ? ({ success: true, data: value } as const)
            : ({ success: false, error: { path: [], message: "Invalid name", code: "invalid" } } as const),
        age: (value) =>
          typeof value === "number"
            ? ({ success: true, data: value } as const)
            : ({ success: false, error: { path: [], message: "Invalid age", code: "invalid" } } as const),
      })(obj);
      expect(result.success).toBe(false);
    });
  });

  describe("exactShape", () => {
    it("should validate exact object shape", () => {
      const obj = { name: "John", age: 30 };
      const result = validators.exactShape({
        name: (value) =>
          typeof value === "string"
            ? ({ success: true, data: value } as const)
            : ({ success: false, error: { path: [], message: "Invalid name", code: "invalid" } } as const),
        age: (value) =>
          typeof value === "number"
            ? ({ success: true, data: value } as const)
            : ({ success: false, error: { path: [], message: "Invalid age", code: "invalid" } } as const),
      })(obj);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(obj);
      }
    });

    it("should reject object with extra keys", () => {
      const obj = { name: "John", age: 30, city: "Bangkok" };
      const result = validators.exactShape({
        name: (value) =>
          typeof value === "string"
            ? ({ success: true, data: value } as const)
            : ({ success: false, error: { path: [], message: "Invalid name", code: "invalid" } } as const),
        age: (value) =>
          typeof value === "number"
            ? ({ success: true, data: value } as const)
            : ({ success: false, error: { path: [], message: "Invalid age", code: "invalid" } } as const),
      })(obj);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Object must have exactly the specified keys");
      }
    });
  });
});
