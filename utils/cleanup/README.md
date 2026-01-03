# @wpackages/cleanup

## Introduction

`@wpackages/cleanup` is a simple and interactive command-line tool for cleaning up common project artifacts. It provides an interactive prompt to select and safely delete temporary files and directories like `node_modules`, `dist` folders, lockfiles, and more.

## Features

- ✨ **Interactive Interface**: A user-friendly wizard powered by `@clack/prompts` guides you through the cleanup process.
- 🎯 **Targeted Cleanup**: Allows you to select exactly which types of artifacts you want to remove.
- 🚀 **Fast and Safe**: Uses `glob` for fast file discovery and `rimraf` for safe and reliable deletion.
- 📦 **Zero-Config**: Works out of the box in any project within the monorepo.

## Goal

- 🎯 **Simplify Project Maintenance**: To provide a single, simple command for cleaning up a project's state.
- 💾 **Free Up Disk Space**: To easily remove large, auto-generated directories like `node_modules`.
- 🔄 **Ensure Clean State**: To help ensure a clean state before a fresh install or build.

## Design Principles

- **User-Friendly**: The interactive prompt makes the tool easy and safe to use, even for destructive operations.
- **Simplicity**: The tool has a single, focused purpose and executes it well.
- **Safety**: Relies on well-tested libraries like `rimraf` to prevent accidental deletion of important files.

## Installation

This is an internal workspace package. Ensure you have installed dependencies from the monorepo root:

```bash
bun install
```

## Usage

To start the interactive cleanup wizard, run the `computer-cleanup` command from the monorepo root. Bun will automatically resolve the binary.

```bash
bun computer-cleanup
```

The tool will then:

1. **Scan Your Workspace**: It searches for common project artifacts based on pre-configured patterns (e.g., `node_modules`, `dist` folders, `.turbo` cache, etc.).
2. **Display Found Items**: It presents you with an interactive list of all the files and directories it found, along with their respective sizes.
3. **Select and Confirm**: You can use the spacebar to select the items you wish to delete.
4. **Clean Up**: After you confirm your selection, the tool will safely delete the chosen items and report the total disk space saved.

## License

This project is licensed under the MIT License.
