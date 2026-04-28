# blog-next Agent Guide

`AGENTS.md` is the Codex-facing entry point for this repo. `CLAUDE.md` carries the same project rules for Claude-oriented workflows.

## Stack

Next.js 16 | React 19 | TypeScript 5 | Biome 2 | Yarn

## Read First

- This repo uses Next.js 16 App Router conventions.
- Content lives in `src/mdx/{category}/{slug}/index.mdx`.
- UI is built with shadcn/ui (new-york) and Tailwind CSS 3.
- Path alias: `@/*` = `./src/*`

## Code Style

- Biome is the formatter/linter of record.
- Use tabs, single quotes, and always include semicolons.
- `arrowParentheses: asNeeded`
- Line width: 120
- Biome exclusions: `src/utils/utils.ts`, `src/components/ui`

## Commands

```bash
yarn dev         # Next.js dev server (Turbopack)
yarn build       # Production build
yarn test        # Vitest run
yarn test:watch  # Vitest watch mode
yarn lint        # biome check --fix .
yarn format      # biome format --fix .
```

## Verification Gates

Run these before finishing substantive code changes:

1. `tsc --noEmit`
2. `vitest run`
3. `biome check .`

All three should pass before considering the change complete.

## Test Convention

- Runner: Vitest with globals enabled
- Test location: colocated (`foo.test.ts` beside `foo.ts`)
- Hooks/components: `@testing-library/react`
- Default environment: `node`
- Use `// @vitest-environment jsdom` only when DOM APIs are required

## TDD Workflow

Expected pipeline:

```text
/spec -> /red -> /green <-> /verify -> /refactor -> /verify -> /commit
```

Per-step constraints:

- `/red`: only create or edit `*.test.ts(x)` files
- `/green`: only edit production code
- Let the artifact of each phase determine the next action
