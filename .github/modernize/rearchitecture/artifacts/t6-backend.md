# t6 — Phase 6 Capacity Planning Services

## Summary

Implemented the Phase 6 NestJS planning service over the existing Prisma planning model. The service keeps draft, validation and publication states distinct; validates order coverage, vehicle availability, trip count, weight, volume and refrigeration constraints; records immutable capacity snapshots through upserted evidence; and exposes explicitly sourced future-capacity scenarios without inventing forecasts or fleet conversion rules.

## Deliverables

- `apps/api/src/modules/planning/planning.dto.ts`
  - Strict DTOs for draft plans, capacity scenarios and scenario filtering.
- `apps/api/src/modules/planning/planning.service.ts`
  - Plan creation/detail retrieval.
  - Current-version validation with blocking and advisory issues.
  - Capacity snapshot persistence and plan validation history.
  - Publication guard that refuses plans with blocking issues.
  - Brand-scoped and depot-only future-capacity scenario upsert/list behavior.
- `apps/api/src/modules/planning/planning.controller.ts`
  - Dispatcher-protected planning routes under `/api/v1/planning`.
- `apps/api/src/modules/planning/planning.module.ts`
  - Modular NestJS wiring through the existing DatabaseModule and AuthModule.
- `apps/api/src/app.module.ts`
  - Registers PlanningModule without changing existing modules.
- `apps/api/test/planning.service.test.ts`
  - Synthetic unit coverage for valid plans, missing coverage, independent capacity violations, reefer requirements, invalid scenarios and publication blocking.

## API Contract

- `POST /api/v1/planning/plans`
- `GET /api/v1/planning/plans/:id`
- `POST /api/v1/planning/plans/:id/validate`
- `PATCH /api/v1/planning/plans/:id/publish`
- `POST /api/v1/planning/capacity-scenarios`
- `GET /api/v1/planning/capacity-scenarios?depotId=...`

All routes require an authenticated Dispatcher role. Fuel remains an advisory `FUEL_ESTIMATE_PENDING` result when route distance data is absent; the service does not fabricate distance or fuel usage.

## Upstream Artifacts Consumed

- `.github/modernize/rearchitecture/clarification.md` — preserved NestJS/PostgreSQL incremental migration, strict TypeScript, RBAC and DEMO-only constraints.
- `.github/modernize/rearchitecture/artifacts/t5-dba.md` — consumed `PlanValidation`, `PlanCapacitySnapshot` and `CapacityPlanningScenario` as the service persistence boundary.
- `.github/modernize/rearchitecture/artifacts/t4-tester.md` — preserved tested Phase 5 behavior and existing synthetic test posture.
- `docs/design-baseline/04-screens-dispatcher.md` — implemented D03/D05/D10/D11 planning evidence and explicit unknown-data behavior.
- `docs/design-baseline/08-states-and-flows.md` — preserved draft/validation/publish distinction, complete coverage requirement, independent capacity checks and no invented priority/forecast rules.
- `AGENTS.md` — followed modular NestJS, strict TypeScript and validation command requirements.

## Evidence Mapping

- `t5-dba.md#Deliverables` -> planning service persists validations, vehicle capacity snapshots and future-capacity scenarios through the new Prisma models.
- `04-screens-dispatcher.md#D03/D05/D10/D11` -> validation issues identify unassigned orders, unavailable vehicles, independent weight/volume limits, refrigeration mismatch and publication blockers.
- `04-screens-dispatcher.md#D10` -> scenario DTO requires source label and stores optional source run date/note; no model confidence or staffing recommendation is produced.
- `08-states-and-flows.md#Plan model` -> publication calls current validation and rejects blocked plans; edits/versions remain represented by the existing plan version model.

## Test Results

- Command: `pnpm --filter @waypoint/api test`
  - Passed: 18; Failed: 0; Skipped: 0.
- Command: `pnpm --filter @waypoint/api typecheck`
  - Passed; no errors.
- Command: `pnpm test`
  - Passed: API 18, web 8; Failed: 0; Skipped: 0.
- Command: `pnpm build`
  - Passed; existing Zod annotation and web bundle-size warnings only.
- Command: `pnpm lint`
  - Passed; no warnings/errors.
- Command: `pnpm exec prettier --check apps/api/src/app.module.ts apps/api/src/modules/planning apps/api/test/planning.service.test.ts`
  - Passed; all touched files formatted.

## Status

Complete for the backend Phase 6 service scope. Authenticated live HTTP/database walkthrough was not rerun in this task because the existing Docker startup was previously nonzero; tester/runtime follow-up should probe the protected routes after the stack is available. No official competition records or datasets were accessed, invented, committed or uploaded; tests use only synthetic `DEMO-*` identities and values.
