/**
 * Tests for advanced string validators
 */

import { describe, it, expect } from "bun:test";
import { isError } from "../../types";
import * as validators from "./string-advanced";

describe("Advanced String Validators", () => {
  describe("alphanumeric", () => {
    it("should validate alphanumeric strings", () => {
      const result = validators.alphanumeric()("abc123");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("abc123");
      }
    });

    it("should reject non-alphanumeric strings", () => {
      const result = validators.alphanumeric()("abc-123");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must contain only alphanumeric characters");
      }
    });
  });

  describe("alpha", () => {
    it("should validate alpha strings", () => {
      const result = validators.alpha()("abc");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("abc");
      }
    });

    it("should reject non-alpha strings", () => {
      const result = validators.alpha()("abc123");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must contain only letters");
      }
    });
  });

  describe("lowercase", () => {
    it("should validate lowercase strings", () => {
      const result = validators.lowercase()("hello");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("hello");
      }
    });

    it("should reject uppercase strings", () => {
      const result = validators.lowercase()("Hello");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be lowercase");
      }
    });
  });

  describe("uppercase", () => {
    it("should validate uppercase strings", () => {
      const result = validators.uppercase()("HELLO");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("HELLO");
      }
    });

    it("should reject lowercase strings", () => {
      const result = validators.uppercase()("hello");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be uppercase");
      }
    });
  });

  describe("startsWith", () => {
    it("should validate prefix", () => {
      const result = validators.startsWith("prefix")("prefix-test");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("prefix-test");
      }
    });

    it("should reject wrong prefix", () => {
      const result = validators.startsWith("prefix")("test-prefix");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe('Value must start with "prefix"');
      }
    });
  });

  describe("endsWith", () => {
    it("should validate suffix", () => {
      const result = validators.endsWith("suffix")("test-suffix");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("test-suffix");
      }
    });

    it("should reject wrong suffix", () => {
      const result = validators.endsWith("suffix")("suffix-test");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe('Value must end with "suffix"');
      }
    });
  });

  describe("contains", () => {
    it("should validate substring", () => {
      const result = validators.contains("middle")("start-middle-end");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("start-middle-end");
      }
    });

    it("should reject missing substring", () => {
      const result = validators.contains("middle")("start-end");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe('Value must contain "middle"');
      }
    });
  });

  describe("hexColor", () => {
    it("should validate hex colors", () => {
      const result = validators.hexColor()("#FF0000");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("#FF0000");
      }
    });

    it("should reject invalid hex colors", () => {
      const result = validators.hexColor()("red");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Invalid hex color format");
      }
    });
  });

  describe("slug", () => {
    it("should validate slugs", () => {
      const result = validators.slug()("hello-world");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("hello-world");
      }
    });

    it("should reject invalid slugs", () => {
      const result = validators.slug()("Hello World");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Invalid slug format");
      }
    });
  });

  describe("json", () => {
    it("should validate JSON strings", () => {
      const result = validators.json()('{"key": "value"}');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('{"key": "value"}');
      }
    });

    it("should reject invalid JSON", () => {
      const result = validators.json()('{"key": value}');
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Invalid JSON format");
      }
    });
  });
});
