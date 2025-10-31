# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Vitalis Pulse** is a NestJS TypeScript backend application. This is currently a fresh starter project with standard NestJS architecture.

## Development Commands

### Building and Running
```bash
# Install dependencies
npm install

# Development with hot-reload
npm run start:dev

# Production build
npm run build

# Run production build
npm run start:prod

# Debug mode with watch
npm run start:debug
```

### Testing
```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Generate test coverage report
npm run test:cov

# Debug tests
npm run test:debug
```

### Code Quality
```bash
# Run ESLint (with auto-fix)
npm run lint

# Format code with Prettier
npm run format
```

## Architecture

### NestJS Module Structure
- **Main Entry**: `src/main.ts` - Bootstrap function that creates the NestJS application on port 3000 (or PORT env variable)
- **Root Module**: `src/app.module.ts` - Main application module that imports all feature modules
- Standard NestJS architecture: Controllers → Services → Modules

### TypeScript Configuration
- **Target**: ES2023
- **Module System**: NodeNext with `nodenext` module resolution
- Decorators enabled (`experimentalDecorators`, `emitDecoratorMetadata`)
- Source maps enabled for debugging
- Output directory: `./dist`

### Testing Strategy
- **Unit tests**: Jest with `*.spec.ts` files co-located with source code in `src/`
- **E2E tests**: Located in `test/` directory with `*.e2e-spec.ts` naming
- Test environment: Node
- Coverage output: `coverage/` directory

### Linting and Code Style
- **ESLint**: Using TypeScript ESLint with type-checked rules
- **Prettier**: Integrated with ESLint for consistent formatting
- Notable ESLint rule overrides:
  - `@typescript-eslint/no-explicit-any`: off
  - `@typescript-eslint/no-floating-promises`: warn
  - `@typescript-eslint/no-unsafe-argument`: warn
  - Prettier end-of-line set to "auto"

## Development Patterns

### Creating New Resources
Use NestJS CLI for scaffolding:
```bash
# Generate a new module
nest g module <name>

# Generate a controller
nest g controller <name>

# Generate a service
nest g service <name>

# Generate a complete resource (module, controller, service)
nest g resource <name>
```

### File Organization
- Place feature-specific code in dedicated modules under `src/`
- Co-locate unit tests with source files (e.g., `user.service.ts` and `user.service.spec.ts`)
- Keep e2e tests in the `test/` directory
