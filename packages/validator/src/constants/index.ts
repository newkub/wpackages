/**
 * Validation constants
 */

export const ERROR_CODES = {
  INVALID_TYPE: "invalid_type",
  INVALID_EMAIL: "invalid_email",
  INVALID_URL: "invalid_url",
  INVALID_UUID: "invalid_uuid",
  INVALID_LENGTH: "invalid_length",
  INVALID_RANGE: "invalid_range",
  INVALID_PATTERN: "invalid_pattern",
  INVALID_DATE: "invalid_date",
  INVALID_ENUM: "invalid_enum",
  REQUIRED: "required",
  CUSTOM: "custom",
} as const;

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  URL: /^https?:\/\/.+/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  CREDIT_CARD: /^\d{13,19}$/,
} as const;
