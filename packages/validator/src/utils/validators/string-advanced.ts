/**
 * Advanced string validators
 */

import { ERROR_CODES, REGEX_PATTERNS } from "../../constants";
import type { Validator, ValidationResult } from "../../types";
import { failure, success } from "../../utils";

export function alphanumeric(): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      return failure("Value must contain only alphanumeric characters", ERROR_CODES.INVALID_PATTERN);
    }
    return success(value);
  };
}

export function alpha(): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    if (!/^[a-zA-Z]+$/.test(value)) {
      return failure("Value must contain only letters", ERROR_CODES.INVALID_PATTERN);
    }
    return success(value);
  };
}

export function lowercase(): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    if (value !== value.toLowerCase()) {
      return failure("Value must be lowercase", ERROR_CODES.CUSTOM);
    }
    return success(value);
  };
}

export function uppercase(): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    if (value !== value.toUpperCase()) {
      return failure("Value must be uppercase", ERROR_CODES.CUSTOM);
    }
    return success(value);
  };
}

export function startsWith(prefix: string): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    if (!value.startsWith(prefix)) {
      return failure(`Value must start with "${prefix}"`, ERROR_CODES.CUSTOM);
    }
    return success(value);
  };
}

export function endsWith(suffix: string): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    if (!value.endsWith(suffix)) {
      return failure(`Value must end with "${suffix}"`, ERROR_CODES.CUSTOM);
    }
    return success(value);
  };
}

export function contains(substring: string): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    if (!value.includes(substring)) {
      return failure(`Value must contain "${substring}"`, ERROR_CODES.CUSTOM);
    }
    return success(value);
  };
}

export function hexColor(): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    if (!REGEX_PATTERNS.HEX_COLOR.test(value)) {
      return failure("Invalid hex color format", ERROR_CODES.INVALID_PATTERN);
    }
    return success(value);
  };
}

export function phone(): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    if (!REGEX_PATTERNS.PHONE.test(value)) {
      return failure("Invalid phone number format", ERROR_CODES.INVALID_PATTERN);
    }
    return success(value);
  };
}

export function creditCard(): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    if (!REGEX_PATTERNS.CREDIT_CARD.test(value)) {
      return failure("Invalid credit card format", ERROR_CODES.INVALID_PATTERN);
    }
    return success(value);
  };
}

export function slug(): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      return failure("Invalid slug format", ERROR_CODES.INVALID_PATTERN);
    }
    return success(value);
  };
}

export function semanticVersion(): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/.test(value)) {
      return failure("Invalid semantic version format", ERROR_CODES.INVALID_PATTERN);
    }
    return success(value);
  };
}

export function ipAddress(): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    if (!ipv4Regex.test(value) && !ipv6Regex.test(value)) {
      return failure("Invalid IP address format", ERROR_CODES.INVALID_PATTERN);
    }
    return success(value);
  };
}

export function json(): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    try {
      JSON.parse(value);
      return success(value);
    } catch {
      return failure("Invalid JSON format", ERROR_CODES.INVALID_PATTERN);
    }
  };
}

export function base64(): Validator<string> {
  return (value: unknown): ValidationResult<string> => {
    if (typeof value !== "string") {
      return failure("Value must be a string", ERROR_CODES.INVALID_TYPE);
    }
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(value) || value.length % 4 !== 0) {
      return failure("Invalid base64 format", ERROR_CODES.INVALID_PATTERN);
    }
    return success(value);
  };
}
