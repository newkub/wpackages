 # wpackages
 
 ## Introduction
 
 `wpackages` is a Bun + TypeScript monorepo (Turborepo) that hosts reusable packages, services, apps, macros, and utilities.
 
 It uses:
 - `bun` as the package manager/runtime
 - `turbo` for orchestrating tasks across workspaces
 - `lefthook` for Git hooks
 - `vitest` for tests (per package)
 
 ## Goal
 
 - Provide a single workspace to develop and share internal libraries (`packages/*`, `services/*`, `utils/*`, `framework/*`, `lib/*`).
 - Keep tooling and conventions consistent across many small projects.
 - Enable fast iteration with task pipelines (`format` -> `lint` -> `test` -> `build` -> `verify`).
 
 ## Design Principles
 
 - **Monorepo first**: workspaces are versioned and developed together.
 - **Automation**: prefer `turbo` tasks over running tools manually.
 - **Consistency**: uniform `tsconfig.json`/scripts across packages.
 - **Safety**: Git hooks run formatting before commit, and build before push.
 
 ## Installation
 
 Prerequisites:
 - `bun` (repo uses `bun@1.3.5`)
 - Git
 
 Install dependencies:
 ```bash
 bun install
 ```
 
 Install Git hooks:
 ```bash
 bun run prepare
 ```
 
 ## Usage
 
 Common root commands:
 ```bash
 bun run format
 bun run lint
 bun run test
 bun run build
 bun run verify
 ```
 
 Run a dev task across workspaces:
 ```bash
 bun run dev
 ```
 
 ## Examples
 
 - Apps live under `apps/*`.
 - Shared libraries live under `packages/*` and `services/*`.
 - Utility libraries live under `utils/*`.
 
 If a workspace provides its own examples or README, see that package folder.
 
 ## License
 
 No license file is currently included at the repository root.
