import { describe, it, expect } from "vitest";
import { ok, err, isSuccess, isFailure, map, mapErr, chain, unwrap, unwrapOr, type Result } from "./result";

describe("Result", () => {
  it("should create a Success result", () => {
    const result = ok(42);
    expect(isSuccess(result)).toBe(true);
    expect(isFailure(result)).toBe(false);
    expect(result).toEqual({ _tag: "Success", value: 42 });
  });

  it("should create a Failure result", () => {
    const result = err("error");
    expect(isSuccess(result)).toBe(false);
    expect(isFailure(result)).toBe(true);
    expect(result).toEqual({ _tag: "Failure", error: "error" });
  });

  it("should map over a Success result", () => {
    const result = ok(5);
    const mapped = map(result, (x) => x * 2);
    expect(mapped).toEqual(ok(10));
  });

  it("should not map over a Failure result", () => {
    const result: Result<string, number> = err("error");
    const mapped = map(result, (x) => x * 2);
    expect(mapped).toEqual(err("error"));
  });

  it("should mapErr over a Failure result", () => {
    const result = err("error");
    const mapped = mapErr(result, (e) => `mapped ${e}`);
    expect(mapped).toEqual(err("mapped error"));
  });

  it("should not mapErr over a Success result", () => {
    const result: Result<string, number> = ok(5);
    const mapped = mapErr(result, (e) => `mapped ${e}`);
    expect(mapped).toEqual(ok(5));
  });

  it("should chain a Success result", () => {
    const result = ok(5);
    const chained = chain(result, (x) => ok(x + 1));
    expect(chained).toEqual(ok(6));
  });

  it("should unwrap a Success result", () => {
    const result = ok(42);
    expect(unwrap(result)).toBe(42);
  });

  it("should throw when unwrapping a Failure result", () => {
    const result = err("error");
    expect(() => unwrap(result)).toThrow("error");
  });

  it("should unwrapOr a Success result", () => {
    const result = ok(42);
    expect(unwrapOr(result, 0)).toBe(42);
  });

  it("should unwrapOr a Failure result with default value", () => {
    const result: Result<string, number> = err("error");
    expect(unwrapOr(result, 0)).toBe(0);
  });
});

