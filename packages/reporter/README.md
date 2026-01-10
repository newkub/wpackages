# @wpackages/reporter

Universal report formatting utilities for code analysis tools with support for multiple output formats and advanced configuration.

## Introduction

@wpackages/reporter is a powerful and flexible reporting library designed for code analysis tools. It provides a unified interface for generating reports in multiple formats including text, JSON, and SARIF (Static Analysis Results Interchange Format). Built with TypeScript and featuring a comprehensive configuration system, it enables developers to create professional, customizable reports for their analysis tools with minimal effort.

## Features

- 📊 **Multiple Output Formats**: Support for text, JSON, and SARIF formats
- 🎨 **Customizable Output**: Advanced configuration for colors, icons, grouping, and more
- 🔧 **Config System**: Flexible configuration with file support (.reporterrc, .reporterrc.json, .reporterrc.ts)
- 🌐 **Workspace Support**: Native support for monorepo/workspace analysis
- 🎯 **Type-Safe**: Full TypeScript support with strict type checking
- 📦 **Minimal Dependencies**: Lightweight with only picocolors as a runtime dependency
- 🔍 **SARIF Standard**: Full compliance with SARIF 2.1.0 specification
- ⚡ **Zero-Cost Abstractions**: Efficient formatting with minimal overhead
- 🛡️ **Config Validation**: Built-in validation for configuration files
- 🎛️ **Severity Levels**: Configurable severity levels with custom exit codes

## Goal

- Provide a universal reporting solution for code analysis tools
- Support industry-standard formats like SARIF for tool interoperability
- Enable customizable and professional report generation
- Support both single package and monorepo analysis scenarios
- Maintain simplicity while providing powerful configuration options

## Design Principles

- **Format Agnostic**: Support multiple formats through a unified API
- **Type Safety**: Leverage TypeScript for compile-time guarantees
- **Extensibility**: Easy to extend with custom formatters and configurations
- **Performance**: Efficient formatting with minimal memory footprint
- **Standards Compliance**: Follow SARIF and other industry standards
- **Developer Experience**: Simple API with sensible defaults
- **Configurability**: Powerful configuration system with validation

## Installation

```bash
# Using bun
bun add @wpackages/reporter

# Using npm
npm install @wpackages/reporter

# Using yarn
yarn add @wpackages/reporter

# Using pnpm
pnpm add @wpackages/reporter
```

## Usage

### Basic Usage

```typescript
import { report } from "@wpackages/reporter";
import type { AnalysisResult } from "@wpackages/reporter";

const result: AnalysisResult = {
  unusedFiles: ["src/unused.ts"],
  unusedDependencies: new Set(["lodash"]),
  unusedExports: new Map([
    ["src/utils.ts", ["helperFunction"]]
  ])
};

await report(result, {
  cwd: process.cwd(),
  format: "text"
});
```

### JSON Format

```typescript
await report(result, {
  cwd: process.cwd(),
  format: "json",
  outputFile: "report.json"
});
```

### SARIF Format

```typescript
await report(result, {
  cwd: process.cwd(),
  format: "sarif",
  outputFile: "report.sarif.json"
});
```

### Workspace Mode

```typescript
import type { WorkspaceAnalysisResult } from "@wpackages/reporter";

const workspaceResult: WorkspaceAnalysisResult = {
  mode: "workspace",
  root: "/path/to/workspace",
  packages: [
    {
      packageName: "package-a",
      cwd: "/path/to/package-a",
      unusedFiles: ["src/unused.ts"],
      unusedDependencies: new Set(["lodash"]),
      unusedExports: new Map()
    },
    {
      packageName: "package-b",
      cwd: "/path/to/package-b",
      unusedFiles: [],
      unusedDependencies: new Set(),
      unusedExports: new Map([["src/index.ts", ["unusedExport"]]])
    }
  ]
};

await report(workspaceResult, {
  cwd: process.cwd(),
  format: "text"
});
```

## Configuration

### Config Files

Create a `.reporterrc` file in your project root:

```json
{
  "format": "json",
  "outputFile": "report.json",
  "severity": {
    "minLevel": "warning",
    "exitCode": {
      "error": 1,
      "warning": 1,
      "info": 0,
      "hint": 0
    }
  },
  "filters": {
    "exclude": {
      "files": ["**/*.test.ts", "**/*.spec.ts"]
    }
  },
  "output": {
    "colors": true,
    "icons": true,
    "groupBy": "file",
    "showSummary": true,
    "showStats": true
  }
}
```

### TypeScript Config

Create a `.reporterrc.ts` file for dynamic configuration:

```typescript
import type { ReporterConfig } from "@wpackages/reporter";

const config: ReporterConfig = {
  format: "text",
  severity: {
    minLevel: "error"
  },
  output: {
    colors: true,
    groupBy: "severity"
  }
};

export default config;
```

### Loading Config Programmatically

```typescript
import { loadConfig } from "@wpackages/reporter";

const { config, configPath } = await loadConfig({
  cwd: process.cwd()
});

console.log("Loaded config from:", configPath);
console.log("Config:", config);
```

### Config Validation

```typescript
import { validateConfig, ConfigValidationError } from "@wpackages/reporter";

try {
  validateConfig(config);
} catch (error) {
  if (error instanceof ConfigValidationError) {
    console.error("Config validation failed:");
    for (const err of error.errors) {
      console.error(`  ${err.path}: ${err.message}`);
    }
  }
}
```

## Examples

### Custom Severity Configuration

```typescript
await report(result, {
  cwd: process.cwd(),
  format: "text",
  severity: {
    minLevel: "error",
    exitCode: {
      error: 1,
      warning: 0,
      info: 0,
      hint: 0
    }
  }
});
```

### Filtering Issues

```typescript
await report(result, {
  cwd: process.cwd(),
  format: "text",
  filters: {
    include: {
      severity: ["error", "warning"]
    },
    exclude: {
      files: ["**/*.test.ts", "**/*.spec.ts"]
    }
  }
});
```

### Custom Output Options

```typescript
await report(result, {
  cwd: process.cwd(),
  format: "text",
  output: {
    colors: true,
    icons: true,
    groupBy: "severity",
    showSummary: true,
    showStats: true
  }
});
```

### Using Formatters Directly

```typescript
import { toJsonReport, toSarifReport, formatTextReport } from "@wpackages/reporter";

// JSON formatter
const jsonReport = toJsonReport(result, process.cwd());
console.log(JSON.stringify(jsonReport, null, 2));

// SARIF formatter
const sarifReport = toSarifReport(result, process.cwd());
console.log(JSON.stringify(sarifReport, null, 2));

// Text formatter (returns issue count)
const issueCount = formatTextReport(result, process.cwd());
console.log(`Found ${issueCount} issues`);
```

## Config Options

### ReporterConfig

```typescript
interface ReporterConfig {
  format?: "text" | "json" | "sarif";
  outputFile?: string;
  cwd?: string;
  severity?: SeverityConfig;
  filters?: FilterConfig;
  rules?: RuleConfig;
  output?: OutputConfig;
  extends?: string | string[];
}
```

### SeverityConfig

```typescript
interface SeverityConfig {
  minLevel?: "error" | "warning" | "info" | "hint";
  exitCode?: {
    error?: number;
    warning?: number;
    info?: number;
    hint?: number;
  };
}
```

### FilterConfig

```typescript
interface FilterConfig {
  include?: {
    files?: string[];
    rules?: string[];
    severity?: SeverityLevel[];
  };
  exclude?: {
    files?: string[];
    rules?: string[];
    severity?: SeverityLevel[];
  };
}
```

### OutputConfig

```typescript
interface OutputConfig {
  colors?: boolean;
  icons?: boolean;
  groupBy?: "file" | "rule" | "severity" | "none";
  showSummary?: boolean;
  showStats?: boolean;
}
```

## License

MIT License - see LICENSE file for details
