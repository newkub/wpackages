# @wts/error

> A type-safe, class-based error handling library for TypeScript, inspired by Rust's robust error management.

`@wts/error` provides a structured and flexible way to manage errors in your applications, ensuring type safety and compatibility with functional programming patterns like `Result<T, E>`.

## Design Principles

-   **Type Safety:** Leverages TypeScript's type system to ensure that errors are handled explicitly and safely, preventing unexpected runtime exceptions.
-   **Class-Based Structure:** Uses a clear class hierarchy with a `CustomError` base class, making it easy to create and extend specific error types.
-   **Rich Context:** Errors are not just messages. They are structured objects that can carry valuable context (e.g., `field`, `resource`, `id`, `cause`) to aid in debugging and handling.
-   **Functional Compatibility:** Designed to work seamlessly with functional utilities like `@wts/functional`, allowing you to use the `Result<T, E>` pattern for cleaner, more predictable code flow.

## Installation

```sh
bun add @wts/error
```

## Usage

The library is built around a central `CustomError` class and a set of pre-defined error classes for common scenarios.

### Creating Errors

You can use the provided creator functions for a more concise way to instantiate errors.

```typescript
import { notFoundError, validationError } from '@wts/error';

// Create a validation error
const emailError = validationError({
  message: 'Invalid email format',
  field: 'email',
  value: 'not-an-email'
});

// Create a "not found" error
const userNotFoundError = notFoundError('User', { id: 123 });
// message: "Resource 'User' with ID '123' not found."
```

### Functions Returning Results

Structure your functions to return a `Result<T, E>` type, where `E` is a specific error type from this library.

```typescript
import { ok, err, type Result } from '@wts/functional';
import { validationError, type ValidationError } from '@wts/error';

function validateEmail(email: string): Result<string, ValidationError> {
  if (!email.includes('@')) {
    return err(validationError({
      message: 'Invalid email format',
      field: 'email',
      value: email
    }));
  }
  return ok(email);
}
```

### Handling Errors with `match`

The `match` function provides a type-safe way to handle different error types, similar to pattern matching in other languages.

```typescript
import { match } from '@wts/error';

const result = validateEmail('not-an-email');

if (result.isErr()) {
  const errorMessage = match(result.error, {
    ValidationError: (e) => `Validation failed on field '${e.field}' with value '${e.value}'.`,
    // Wildcard for any other error type
    _: (e) => `An unexpected error occurred: ${e.message}`
  });
  console.log(errorMessage);
  // Output: "Validation failed on field 'email' with value 'not-an-email'."
}
```

## Examples

Here is a more complete example showing how to find a resource and handle potential errors.

```typescript
import { ok, err, type Result } from '@wts/functional';
import { notFoundError, match, fromUnknown, type NotFoundError, type AppError } from '@wts/error';

interface User {
  id: number;
  name: string;
}

// A mock database call
async function findUserById(id: number): Promise<User | null> {
  if (id === 1) {
    return { id: 1, name: 'Alice' };
  }
  return null;
}

async function getUser(id: number): Promise<Result<User, NotFoundError | AppError>> {
  try {
    const user = await findUserById(id);
    if (!user) {
      // Return a specific, structured error
      return err(notFoundError('User', { id }));
    }
    // Return the successful result
    return ok(user);
  } catch (e) {
    // Wrap unknown exceptions into a standard AppError
    return err(fromUnknown(e));
  }
}

// --- Usage ---
async function main() {
  const userResult = await getUser(2);

  if (userResult.isErr()) {
    const message = match(userResult.error, {
      NotFoundError: (e) => `Could not find resource '${e.resource}' with ID '${e.id}'.`,
      AppError: (e) => `An application error occurred: ${e.message}`,
      _: () => 'An unknown error happened.'
    });
    console.error(message);
    // Output: "Could not find resource 'User' with ID '2'."
  } else {
    console.log(`Found user: ${userResult.value.name}`);
  }
}

main();
```

## License

This project is licensed under the MIT License.
