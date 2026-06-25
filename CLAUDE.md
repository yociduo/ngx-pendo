# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ngx-pendo is an Angular library that wraps the [Pendo](https://agent.pendo.io/) analytics platform for Angular 17+ applications. It provides directives to annotate DOM elements with Pendo tracking IDs and a service to interact with the Pendo JavaScript SDK. Published on npm as `ngx-pendo`.

## Development Commands

```bash
pnpm start                       # Serve the root demo app
pnpm run start:example           # Serve the module-based example app
pnpm run start:standalone        # Serve the standalone API example app

pnpm run build:lib               # Build the library (ng-packagr → dist/ngx-pendo)
pnpm run build:schematics        # Compile schematics TypeScript and copy schema.json/collection.json to dist

pnpm test                        # Run all tests (watch mode)
pnpm run test:ci                 # Run all tests (single run, for CI)
ng test ngx-pendo                # Run library tests only
ng test ngx-pendo --watch=false  # Run library tests (single run)

pnpm lint                        # Lint all projects
ng lint ngx-pendo                # Lint library only

pnpm run version                 # Bump version via standard-version (in projects/ngx-pendo)
pnpm run publish                 # Publish from dist/ngx-pendo to npm
```

## Architecture

This is an Angular CLI workspace with four projects defined in `angular.json`:

- **ngx-pendo** (`projects/ngx-pendo/`) — The publishable library. Built with ng-packagr.
- **ngx-pendo-demo** (`src/`) — Root demo app (module-based).
- **example-app** (`projects/example-app/`) — Module-based example app.
- **standalone-app** (`projects/standalone-app/`) — Standalone API example app.

### Library Core (`projects/ngx-pendo/src/lib/`)

The library supports two consumption patterns:

1. **Module-based**: `NgxPendoModule.forRoot(settings)` / `NgxPendoModule.forChild()`
2. **Standalone API**: `provideNgxPendo(settings)` function

Key internal flow:

- `NGX_PENDO_SETTINGS_TOKEN` — Injection token for `IPendoSettings` (apiKey, optional formatter, optional script origin, optional initializer provider).
- `NGX_PENDO_WINDOW` — Injects the browser window (typed as `PendoWindow`).
- `NGX_PENDO_CONTEXT` — Injects the `window.pendo` object (typed as `IPendo`), used by `NgxPendoService`.
- `NGX_PENDO_INITIALIZER_PROVIDER` — `APP_INITIALIZER` that dynamically loads the Pendo SDK script from CDN. Still uses `APP_INITIALIZER` (not `provideAppInitializer`) to support Angular 17–22.
- `NgxPendoService` — Facade over the raw `IPendo` context. Provides `initialize`, `identify`, `track`, `formatPendoId`, `teardown`, etc. Uses optional `pendoIdFormatter` from settings.

### Directives (both are standalone)

- `NgxPendoSectionDirective` (`[ngx-pendo-section]`) — Sets `data-pendo-section` attribute. Uses `contentChildren` to link child directives, building a parent tree via `effect()`.
- `NgxPendoIdDirective` (`[ngx-pendo-id]`) — Sets `data-pendo-id` attribute. Computes a merged ID by walking parent sections (via `computed()` signal). Supports `ngx-pendo-inherit` input to opt out of section inheritance.

The directives produce dot-separated `data-pendo-id` values by concatenating ancestor sections with the leaf ID, e.g. `section.subsection.button`. The `pendoIdFormatter` function is applied to each segment before joining.

### Schematics (`projects/ngx-pendo/schematics/`)

`ng add ngx-pendo` schematic that:
- Adds `ngx-pendo` to package.json dependencies
- For module-based apps: imports `NgxPendoModule.forRoot(...)` in `AppModule`
- For standalone apps: adds `provideNgxPendo(...)` to `app.config.ts`
- Detects standalone vs module-based using `isStandaloneApp()` from `@schematics/angular`

Build: `pnpm run build:schematics` compiles TypeScript via `tsconfig.schematics.json` then copies schema/collection JSON files to `dist/ngx-pendo/schematics/`.

## Testing

Library tests use **Vitest** (configured via `types: ["vitest/globals"]` in `tsconfig.spec.json`). Tests use `vi.fn()` for mocks and `provideZonelessChangeDetection()` in TestBed.

- Directive tests (`ngx-pendo.directive.spec.ts`) — Component fixture tests verifying `data-pendo-id` attribute rendering, dynamic changes, and inherit behavior.
- Service tests (`ngx-pendo.service.spec.ts`) — Verifies service methods delegate to the pendo SDK mock.
- Module tests (`ngx-pendo.module.spec.ts`) — Tests `forRoot`/`forChild` including lazy-loaded module support.
- Schematic tests (`schematics/ng-add/index.spec.ts`) — Uses `SchematicTestRunner` from `@angular-devkit/schematics/testing`.

## Conventions

- **Package manager**: pnpm only.
- **Node**: ≥22.22.3 (see `.nvmrc` for 22.22.3).
- **Commit messages**: Conventional Commits enforced via commitlint + husky `commit-msg` hook.
- **Pre-commit**: lint-staged runs ESLint, stylelint, and prettier on staged files.
- **Directive selector prefix**: `ngx-pendo` (kebab-case attribute selector).
- **Prettier**: Single quotes for TS, double quotes for JSON/SCSS, print width 120, no trailing commas.
