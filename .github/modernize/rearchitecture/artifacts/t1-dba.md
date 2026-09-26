# t1 — Phase 5 Ordering Persistence

## Summary
Phase 5 ordering persistence is complete for the DBA scope. The schema now models intake runs and stores order intake metadata needed by the confirmed-order queue, while preserving existing Phase 1-4 rows through additive nullable/defaulted changes.

## Deliverables
- [schema.prisma](../../../../apps/api/prisma/schema.prisma) — `IntakeRun`, `IntakeRunStatus`, order windows/access/cutoff metadata, relations and indexes.
- [migration.sql](../../../../apps/api/prisma/migrations/20260926103000_phase5_ordering/migration.sql) — additive PostgreSQL migration with foreign keys and indexes.
- [seed.ts](../../../../apps/api/scripts/seed.ts) — idempotent DEMO-only intake run and order metadata fixture.

## Upstream Artifacts Consumed
- `.github/modernize/rearchitecture/clarification.md` — required in-place Prisma migration strategy, DEMO-only data, and ordering behavior constraints.
- `AGENTS.md` — Prisma location, strict TypeScript, and no official dataset handling.
- `docs/design-baseline/04-screens-dispatcher.md` — D02 intake fields, cutoff, distinct order rows, and eligibility source.
- `docs/design-baseline/07-screens-store.md` — M02 order capture and server cutoff validation requirements.
- `docs/design-baseline/08-states-and-flows.md` — order confirmation/defer history semantics.
- `docs/design-baseline/11-illustrative-prototype-scenario.md` — synthetic identity and labeling rules.

## Evidence Mapping
- `clarification.md#Backend` → incremental migration `20260926103000_phase5_ordering` and preserved existing schema.
- `04-screens-dispatcher.md#D02` → `IntakeRun`, `cutoffAt`, `requestedWindowOpen/Close`, `accessRequirement`, `mallWindow`, and query indexes.
- `07-screens-store.md#M02` → `confirmedAt` and intake-run association for accepted order provenance.
- `08-states-and-flows.md#1-Order-model` → retained `Deferral` history and separate intake relation; no lifecycle collapse was introduced.

## Test Results
- Command: `pnpm --filter @waypoint/api db:generate` — Passed.
- Command: `pnpm --filter @waypoint/api build` — Passed.
- Command: `pnpm --filter @waypoint/api db:check` — Passed; PostgreSQL connectivity OK.
- Command: `pnpm db:migrate` — Passed; migration applied.
- Command: `pnpm db:migrate` (repeat) — Passed; no pending migrations.
- Command: `pnpm --filter @waypoint/api db:seed` — Passed; synthetic seed completed.
- Command: `pnpm --filter @waypoint/api test` — Passed: 8, Failed: 0, Skipped: 0.
- Command: `pnpm --filter @waypoint/api typecheck` — Passed.
- Command: `pnpm lint` — Passed.
- Command: `pnpm typecheck` — Passed.
- Command: `pnpm build` — Passed; existing Vite chunk-size and dependency annotation warnings only.
- Command: `pnpm format:check` — Failed on 63 pre-existing files; changed TypeScript file is formatted and Prettier has no parser for Prisma schema/SQL. No unrelated files were reformatted.
- Command: `git diff --check -- apps/api/prisma/schema.prisma apps/api/prisma/migrations/20260926103000_phase5_ordering/migration.sql apps/api/scripts/seed.ts` — Passed; only expected CRLF normalization warnings were reported by Git.

## Compatibility and Risks
- Changes are additive: existing orders may have null Phase 5 metadata until the ordering API populates it.
- `IntakeRun` and order intake links use `RESTRICT` deletes to prevent silent loss of planning history.
- Prisma migration deployment is tracked by Prisma and was verified with a repeat deploy; direct SQL re-execution is intentionally not a supported rollback path.
- No official competition records, datasets, or derivatives were accessed or added.

## Status
Complete for t1 DBA scope. Backend API/domain behavior and frontend workflows remain downstream tasks.
