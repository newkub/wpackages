# check

Comprehensive code quality checker with TypeScript, unused code detection, dependency analysis, and more - Built with Effect-TS.

## Features

- 🔍 **Type Checking** - Full TypeScript type checking
- 🧹 **Unused Code** - Detect unused variables, imports, and exports
- 📦 **Dependencies** - Check dependency versions and usage
- 🔗 **Imports** - Validate import paths and extensions
- ♻️ **Circular Dependencies** - Detect circular dependency chains
- 📊 **Complexity** - Measure code complexity
- 🎯 **Parallel Execution** - Run checks concurrently
- 🎨 **Beautiful Output** - Colorful, readable reports
- ✨ **Interactive Mode** - User-friendly interactive prompt

## Installation

```bash
bun add -D @wpackages/check
```

## Usage

### CLI

The CLI runs in interactive mode, allowing you to select which checks to run.

```bash
# Run the interactive checker
bun run dev

# Or, after installation:
wcheck
```

### Programmatic

```typescript
import { runChecker } from "@wpackages/check";
import { Effect } from "effect";

const program = runChecker({
	types: ["type", "unused", "deps"],
});

await Effect.runPromise(program);
```

## Check Types

- **type** - TypeScript type checking via compiler API
- **unused** - Find unused variables, imports, parameters
- **deps** - Check package.json dependencies
- **depsUpdate** - Check for outdated dependencies
- **imports** - Validate import statements and paths
- **circular** - Detect circular dependency chains
- **complexity** - Measure cyclomatic complexity
- **size** - Check file sizes
- **duplicates** - Find duplicate code blocks
- **security** - Security vulnerability checks
- **typeSafe** - Check type safety settings
- **sideEffect** - Detect side effects in code
- **type-analysis** - Analyze and display type declarations for variables

## Options

```typescript
interface CheckerOptions {
	types: CheckType[]; // Which checks to run
	include?: string[]; // Glob patterns to include
	exclude?: string[]; // Glob patterns to exclude
}
```

## Examples

### Basic Usage

```typescript
import { runChecker } from "check";

// Run with defaults
await runChecker();

// Custom configuration
await runChecker({
	types: ["type", "circular"],
	parallel: true,
	verbose: true,
});
```

### Integration with CI/CD

```json
{
	"scripts": {
		"check": "wcheck --all",
		"check:type": "wcheck -t type",
		"check:ci": "wcheck --all --output json"
	}
}
```

## License

MIT
