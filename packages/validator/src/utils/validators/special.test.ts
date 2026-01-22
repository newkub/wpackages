/**
 * Tests for special validators
 */

import { describe, it, expect } from "bun:test";
import { isError } from "../../types";
import * as validators from "./special";

describe("Special Validators", () => {
  describe("nullValue", () => {
    it("should validate null", () => {
      const result = validators.nullValue()(null);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(null);
      }
    });

    it("should reject non-null", () => {
      const result = validators.nullValue()(undefined);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be null");
      }
    });
  });

  describe("undefinedValue", () => {
    it("should validate undefined", () => {
      const result = validators.undefinedValue()(undefined);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(undefined);
      }
    });

    it("should reject defined values", () => {
      const result = validators.undefinedValue()(null);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be undefined");
      }
    });
  });

  describe("nil", () => {
    it("should validate null or undefined", () => {
      const result = validators.nil()(null);
      expect(result.success).toBe(true);
    });

    it("should reject defined values", () => {
      const result = validators.nil()(0);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be null or undefined");
      }
    });
  });

  describe("defined", () => {
    it("should validate defined values", () => {
      const result = validators.defined()("hello");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("hello");
      }
    });

    it("should reject undefined", () => {
      const result = validators.defined()(undefined);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be defined");
      }
    });
  });

  describe("symbol", () => {
    it("should validate symbols", () => {
      const result = validators.symbol()(Symbol("test"));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data).toBe("symbol");
      }
    });

    it("should reject non-symbols", () => {
      const result = validators.symbol()("symbol");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a symbol");
      }
    });
  });

  describe("bigInt", () => {
    it("should validate bigints", () => {
      const result = validators.bigInt()(123n);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(123n);
      }
    });

    it("should reject non-bigints", () => {
      const result = validators.bigInt()(123);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a bigint");
      }
    });
  });

  describe("date", () => {
    it("should validate dates", () => {
      const result = validators.date()(new Date());
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeInstanceOf(Date);
      }
    });

    it("should reject invalid dates", () => {
      const result = validators.date()(new Date("invalid"));
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a valid date");
      }
    });
  });

  describe("regexp", () => {
    it("should validate regex", () => {
      const result = validators.regexp()(/test/);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeInstanceOf(RegExp);
      }
    });

    it("should reject non-regex", () => {
      const result = validators.regexp()("test");
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a regular expression");
      }
    });
  });

  describe("promise", () => {
    it("should validate promises", () => {
      const value = Promise.resolve(1);
      const result = validators.promise<number>()(value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    });

    it("should reject non-promises", () => {
      const result = validators.promise<number>()(123);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a promise");
      }
    });
  });

  describe("error", () => {
    it("should validate Error objects", () => {
      const err = new Error("boom");
      const result = validators.error()(err);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(err);
      }
    });

    it("should reject non-Error values", () => {
      const result = validators.error()({ message: "boom" });
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be an Error");
      }
    });
  });

  describe("buffer", () => {
    it("should validate Buffer", () => {
      const buf = Buffer.from("hello");
      const result = validators.buffer()(buf);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(buf);
      }
    });

    it("should reject non-Buffer values", () => {
      const result = validators.buffer()(new Uint8Array([1, 2, 3]));
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a Buffer");
      }
    });
  });

  describe("arrayBuffer", () => {
    it("should validate ArrayBuffer", () => {
      const buf = new ArrayBuffer(8);
      const result = validators.arrayBuffer()(buf);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(buf);
      }
    });

    it("should reject non-ArrayBuffer values", () => {
      const result = validators.arrayBuffer()(new Uint8Array([1, 2, 3]));
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be an ArrayBuffer");
      }
    });
  });

  describe("dataView", () => {
    it("should validate DataView", () => {
      const view = new DataView(new ArrayBuffer(8));
      const result = validators.dataView()(view);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(view);
      }
    });

    it("should reject non-DataView values", () => {
      const result = validators.dataView()(new ArrayBuffer(8));
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a DataView");
      }
    });
  });

  describe("typedArray", () => {
    it("should validate typed arrays", () => {
      const value = new Uint8Array([1, 2, 3]);
      const result = validators.typedArray<Uint8Array>()(value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    });

    it("should accept DataView (ArrayBufferView)", () => {
      const value = new DataView(new ArrayBuffer(8));
      const result = validators.typedArray<DataView>()(value);
      expect(result.success).toBe(true);
    });

    it("should reject non-views", () => {
      const result = validators.typedArray<Uint8Array>()(new ArrayBuffer(8));
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a typed array");
      }
    });
  });

  describe("instanceOf", () => {
    it("should validate instance of constructor", () => {
      class A {}
      const value = new A();
      const result = validators.instanceOf(A)(value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    });

    it("should reject non-instance", () => {
      class A {}
      class B {}
      const result = validators.instanceOf(A)(new B());
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be an instance of A");
      }
    });
  });

  describe("classOf", () => {
    it("should validate classes", () => {
      abstract class A {}
      const result = validators.classOf(A)(class B {});
      expect(result.success).toBe(true);
    });

    it("should reject non-functions", () => {
      abstract class A {}
      const result = validators.classOf(A)(123);
      expect(result.success).toBe(false);
      if (isError(result)) {
        expect(result.error.message).toBe("Value must be a class");
      }
    });
  });
});
