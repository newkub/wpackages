/**
 * Tests for string validators
 */

import { describe, it, expect } from "bun:test";
import { isError } from "../../types";
import * as validators from "./string";

describe("String Validators", () => {
  describe("email", () => {
    it("should validate email format", () => {
      const result = validators.email()("test@example.com");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("test@example.com");
      }
    });

    it("should reject invalid email", () => {
      const result = validators.email()("invalid");
      if (isError(result)) {
        expect(result.error.message).toBe("Invalid email format");
      }
    });
  });

  describe("url", () => {
    it("should validate URL format", () => {
      const result = validators.url()("https://example.com");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("https://example.com");
      }
    });

    it("should reject invalid URL", () => {
      const result = validators.url()("invalid");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Invalid URL format");
      }
    });
  });

  describe("uuid", () => {
    it("should validate UUID format", () => {
      const result = validators.uuid()("123e4567-e89b-12d3-a456-426614174000");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("123e4567-e89b-12d3-a456-426614174000");
      }
    });

    it("should reject invalid UUID", () => {
      const result = validators.uuid()("invalid");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Invalid UUID format");
      }
    });
  });

  describe("minLength", () => {
    it("should validate minimum length", () => {
      const result = validators.minLength(5)("hello");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("hello");
      }
    });

    it("should reject string too short", () => {
      const result = validators.minLength(5)("hi");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Minimum length is 5");
      }
    });
  });

  describe("maxLength", () => {
    it("should validate maximum length", () => {
      const result = validators.maxLength(10)("hello");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("hello");
      }
    });

    it("should reject string too long", () => {
      const result = validators.maxLength(5)("hello world");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Maximum length is 5");
      }
    });
  });

  describe("pattern", () => {
    it("should validate pattern", () => {
      const result = validators.pattern(/^[a-z]+$/)("hello");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("hello");
      }
    });

    it("should reject non-matching pattern", () => {
      const result = validators.pattern(/^[a-z]+$/)("Hello123");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value does not match pattern ^[a-z]+$");
      }
    });
  });

  describe("stringNonEmpty", () => {
    it("should validate non-empty strings", () => {
      const result = validators.stringNonEmpty()("hello");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("hello");
      }
    });

    it("should reject empty strings", () => {
      const result = validators.stringNonEmpty()("");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("String must not be empty");
      }
    });

    it("should reject non-strings", () => {
      const result = validators.stringNonEmpty()(123);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a string");
      }
    });
  });

  describe("trim", () => {
    it("should trim strings", () => {
      const result = validators.trim()("  hello  ");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("hello");
      }
    });

    it("should reject non-strings", () => {
      const result = validators.trim()(null);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a string");
      }
    });
  });
});
