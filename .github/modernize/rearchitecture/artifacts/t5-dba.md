# t5 — Phase 6 Capacity Planning Data Model

## Summary

Implemented an additive Prisma schema and migration for Phase 6 planning evidence. Existing Phase 3–5 entities and migration history remain intact.

## Deliverables

- `apps/api/prisma/schema.prisma`
  - Added `PlanValidationStatus` and `PlanValidation` for version-scoped validation history.
  - Added `PlanCapacitySnapshot` for immutable vehicle capability, availability, capacity usage and fuel reservation facts used during review.
  - Added `CapacityPlanningScenario` for explicitly sourced depot/brand/ISO-week future-capacity assumptions.
- `apps/api/prisma/migrations/20260926113000_phase6_capacity_planning/migration.sql`
  - Adds tables, indexes, restrictive foreign keys and checks for non-negative capacity values, valid ISO week, date order and chilled volume not exceeding total volume.
- `apps/api/scripts/seed.ts`
  - Adds idempotent `DEMO-*` validation, capacity snapshot and illustrative scenario fixtures.
- `docs/data-model/README.md`
  - Documents the Phase 6 model and compatibility boundaries.

## Upstream Artifacts Consumed

- `.github/modernize/rearchitecture/clarification.md` — preserved Prisma/PostgreSQL in-place migration strategy, strict TypeScript, and DEMO-only data constraints.
- `.github/modernize/rearchitecture/artifacts/t4-tester.md` — preserved Phase 5 ordering contract and its stated runtime limitations.
- `docs/design-baseline/04-screens-dispatcher.md` — mapped D03/D05/D10/D11 planning facts to durable model evidence.
- `docs/design-baseline/08-states-and-flows.md` — preserved draft/validation/publish distinctions and independent capacity/issue dimensions.

## Evidence Mapping

- `t4-tester.md#Status` -> additive migration preserves tested Phase 5 ordering tables and seed relations; no existing ordering source fields were changed.
- `04-screens-dispatcher.md#D03/D05/D10/D11` -> `PlanValidation`, `PlanCapacitySnapshot`, and `CapacityPlanningScenario` provide durable inputs/history for planning workspace, fleet constraints, future-capacity provenance and publication review.
- `08-states-and-flows.md#Plan model` -> validation is keyed by plan/version and restrictive history preserves prior results; service-layer rules remain outside the schema.

## Compatibility and Migration Risk

- Migration is additive and applied successfully to the local PostgreSQL database after all prior migrations.
- Foreign keys use `RESTRICT`; deleting referenced planning evidence requires an explicit retention decision.
- No columns were dropped or narrowed. Existing rows remain valid.
- Prisma migration diff could not run because the repository's `prisma.config.ts` has no `shadowDatabaseUrl`; migration deployment plus fresh generated-client/type checks were used instead.

## Test Results

- Command: `pnpm --filter @waypoint/api exec prisma validate`
  - Passed: schema valid
- Command: `pnpm --filter @waypoint/api db:generate`
  - Passed: Prisma Client generated
- Command: `pnpm --filter @waypoint/api db:migrate`
  - Passed: Phase 6 migration applied to local PostgreSQL
- Command: `pnpm --filter @waypoint/api db:check`
  - Passed: database connectivity OK
- Command: `pnpm --filter @waypoint/api db:seed` (two consecutive runs)
  - Passed: both runs; synthetic seed remained idempotent
- Command: `pnpm --filter @waypoint/api test`
  - Passed: 13; Failed: 0; Skipped: 0
- Command: `pnpm lint`
  - Passed; Failed: 0
- Command: `pnpm typecheck`
  - Passed; Failed: 0
- Command: `pnpm test`
  - Passed: API 13, web 8; Failed: 0; Skipped: 0
- Command: `pnpm build`
  - Passed; existing dependency annotation and bundle-size warnings only
- Command: `pnpm exec prettier --check apps/api/scripts/seed.ts`
  - Passed
- Command: `pnpm exec prettier --check apps/api/prisma/schema.prisma .../migration.sql`
  - Not applicable: repository Prettier has no parser for Prisma schema/SQL; no source formatting was changed by this check.

## Status

Complete for the DBA Phase 6 data-model scope. Backend service implementation must consume these models in t6; no official competition data was accessed, invented, committed or uploaded.
