/**
 * Tests for date validators
 */

import { describe, it, expect } from "bun:test";
import { isError } from "../../types";
import * as validators from "./date";

describe("Date Validators", () => {
  describe("minDate", () => {
    it("should validate minimum date", () => {
      const minDate = new Date("2024-01-01");
      const testDate = new Date("2024-06-01");
      const result = validators.minDate(minDate)(testDate);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(testDate);
      }
    });

    it("should reject date before minimum", () => {
      const minDate = new Date("2024-06-01");
      const testDate = new Date("2024-01-01");
      const result = validators.minDate(minDate)(testDate);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Date must be after 2024-06-01T00:00:00.000Z");
      }
    });
  });

  describe("maxDate", () => {
    it("should validate maximum date", () => {
      const maxDate = new Date("2024-12-31");
      const testDate = new Date("2024-06-01");
      const result = validators.maxDate(maxDate)(testDate);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(testDate);
      }
    });

    it("should reject date after maximum", () => {
      const maxDate = new Date("2024-06-01");
      const testDate = new Date("2024-12-31");
      const result = validators.maxDate(maxDate)(testDate);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Date must be before 2024-06-01T00:00:00.000Z");
      }
    });
  });

  describe("past", () => {
    it("should validate past dates", () => {
      const pastDate = new Date("2023-01-01");
      const result = validators.past()(pastDate);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(pastDate);
      }
    });

    it("should reject future dates", () => {
      const result = validators.past()(new Date());
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Date must be in the past");
      }
    });
  });

  describe("future", () => {
    it("should validate future dates", () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const result = validators.future()(futureDate);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(futureDate);
      }
    });

    it("should reject past dates", () => {
      const pastDate = new Date("2023-01-01");
      const result = validators.future()(pastDate);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Date must be in the future");
      }
    });
  });

  describe("today", () => {
    it("should validate today's date", () => {
      const today = new Date();
      const result = validators.today()(today);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(today);
      }
    });

    it("should reject non-today dates", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = validators.today()(yesterday);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Date must be today");
      }
    });
  });
});
