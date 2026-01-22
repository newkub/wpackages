/**
 * Error handling
 */

export class ValidationErrorError extends Error {
  public readonly code: string;
  public readonly path: readonly string[];

  constructor(message: string, code: string, path: readonly string[] = []) {
    super(message);
    this.name = "ValidationError";
    this.code = code;
    this.path = path;
  }
}

export class MultipleValidationErrors extends Error {
  public readonly errors: ValidationErrorError[];

  constructor(errors: ValidationErrorError[]) {
    super("Multiple validation errors");
    this.name = "MultipleValidationErrors";
    this.errors = errors;
  }
}
