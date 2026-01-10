# @wpackages/macros-bun - Idea Features

## High Priority Features

### 1. Enhanced Glob Pattern Support
- **Why**: Current implementation only supports `*` and `**`, limiting flexibility
- **What**: Add support for full glob patterns
  - `?` - single character
  - `[abc]` - character class
  - `{a,b,c}` - alternation
  - `!(pattern)` - negation
- **Impact**: Better file matching, competitive with Vite

### 2. Schema-Based Env Validation
- **Why**: T3 Env offers robust validation with Zod/Valibot
- **What**: Add `envSchema` macro with schema validation
  ```typescript
  const config = envSchema({
    API_KEY: z.string().min(1),
    PORT: z.number().default(3000),
    DEBUG: z.boolean().default(false)
  })
  ```
- **Impact**: Type-safe validation, competitive with T3 Env

### 3. Conditional Compilation
- **Why**: TypeScript transformers offer this, but macros can be simpler
- **What**: Add `ifdef` / `ifndef` macros for build-time conditionals
  ```typescript
  ifdef("DEBUG", () => {
    log.debug("Debug mode enabled")
  })
  ```
- **Impact**: Zero-cost feature flags, smaller bundles

### 4. Asset Optimization
- **Why**: embedBase64 is basic, Vite offers automatic optimization
- **What**: Add `embedOptimized` macro
  - Automatic image compression (sharp)
  - WebP/AVIF conversion
  - Size threshold detection
- **Impact**: Smaller bundles, better performance

### 5. Config File Generation
- **Why**: No way to generate config files at build time
- **What**: Add `writeConfig` macro
  ```typescript
  writeConfig("./generated/config.json", {
    version: env("APP_VERSION"),
    buildTime: new Date().toISOString()
  })
  ```
- **Impact**: Dynamic config generation, CI/CD friendly

## Medium Priority Features

### 6. JSON Schema Generation
- **Why**: Documentation and validation tools need schemas
- **What**: Add `generateSchema` macro from TypeScript types
  ```typescript
  interface Config {
    apiKey: string
    port: number
  }
  const schema = generateSchema<Config>()
  ```
- **Impact**: Auto-documentation, validation tools

### 7. Internationalization (i18n)
- **Why**: Build-time i18n reduces bundle size
- **What**: Add `i18n` macro
  ```typescript
  const messages = i18n("./locales/*.json")
  // Only includes used translations
  ```
- **Impact**: Smaller bundles, better DX

### 8. CSS-in-JS Extraction
- **Why**: Runtime CSS-in-JS has overhead
- **What**: Add `extractCSS` macro
  ```typescript
  const styles = extractCSS`
    .container { color: ${env("THEME_COLOR")}; }
  `
  ```
- **Impact**: Zero runtime CSS, better performance

### 9. Database Schema Validation
- **Why**: Bun macros can safely access databases at build time
- **What**: Add `validateSchema` macro
  ```typescript
  validateSchema({
    tableName: "users",
    schema: z.object({
      id: z.number(),
      email: z.string().email()
    })
  })
  ```
- **Impact**: Catch schema mismatches early

### 10. Version Management
- **Why**: No built-in version tracking
- **What**: Add `version` macro
  ```typescript
  const appVersion = version() // from package.json
  const buildVersion = version("commit") // git commit hash
  ```
- **Impact**: Better version tracking, debugging

## Low Priority Features

### 11. Code Generation Templates
- **Why**: Boilerplate code generation saves time
- **What**: Add `generate` macro with templates
  ```typescript
  generate("api-route", { path: "/users", methods: ["GET", "POST"] })
  ```
- **Impact**: Faster development, consistent patterns

### 12. Benchmarking Macros
- **Why**: Performance testing at build time
- **What**: Add `benchmark` macro
  ```typescript
  benchmark("sort", () => {
    // code to benchmark
  })
  ```
- **Impact**: Performance insights, optimization

### 13. Migration Scripts
- **Why**: Database migrations need to run at build time
- **What**: Add `migrate` macro
  ```typescript
  migrate("./migrations/*.sql")
  ```
- **Impact**: Automated migrations, CI/CD integration

### 14. Documentation Generation
- **Why**: Auto-generate docs from code
- **What**: Add `generateDocs` macro
  ```typescript
  generateDocs({
    output: "./docs",
    format: "markdown"
  })
  ```
- **Impact**: Always up-to-date documentation

### 15. Testing Utilities
- **Why**: Build-time test generation
- **What**: Add `generateTests` macro
  ```typescript
  generateTests({
    coverage: 80,
    frameworks: ["vitest"]
  })
  ```
- **Impact**: Better test coverage, automated testing

## Experimental Ideas

### 16. AI-Powered Code Suggestions
- **Why**: Leverage AI for code generation
- **What**: Add `suggest` macro
  ```typescript
  const optimized = suggest("optimize", code)
  ```
- **Impact**: AI-assisted development

### 17. Cross-Platform Compatibility
- **Why**: Currently Bun-only
- **What**: Create adapter layer for Vite/Rollup
  ```typescript
  // Use as unplugin
  import macros from "@wpackages/macros-bun/unplugin"
  ```
- **Impact**: Broader ecosystem adoption

### 18. Real-time Hot Reload
- **Why**: Better DX during development
- **What**: Add `watch` macro
  ```typescript
  watch("./data/*.json", (files) => {
    // rebuild on change
  })
  ```
- **Impact**: Faster iteration, better DX

### 19. Dependency Injection
- **Why**: Better code organization
- **What**: Add `inject` macro
  ```typescript
  inject("database", () => new Database(env("DB_URL")))
  ```
- **Impact**: Cleaner code, testability

### 20. Performance Profiling
- **Why**: Build-time performance analysis
- **What**: Add `profile` macro
  ```typescript
  profile("api-call", () => {
    // code to profile
  })
  ```
- **Impact**: Performance insights, optimization

## Implementation Priority

1. **Phase 1** (Core Enhancements): Enhanced Glob, Schema Validation, Conditional Compilation
2. **Phase 2** (Asset Optimization): Asset Optimization, Config Generation
3. **Phase 3** (DX Improvements): JSON Schema, i18n, CSS Extraction
4. **Phase 4** (Advanced Features): Database Validation, Version Management
5. **Phase 5** (Experimental): AI Suggestions, Cross-Platform, Hot Reload