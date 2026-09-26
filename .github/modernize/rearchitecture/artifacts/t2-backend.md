# t2 — Phase 5 Ordering APIs and Domain Rules

## Summary
Implemented the Phase 5 ordering API in the existing NestJS modular monolith. Store Managers can submit distinct confirmed orders for their authorized outlet, Dispatcher/Store roles can read scoped order queues and details, and the service enforces server-side intake eligibility, delivery-window validation, DEMO-only request references, and idempotent retries.

## Deliverables
- [orders.module.ts](../../../../apps/api/src/modules/orders/orders.module.ts) — module wiring with existing database/auth modules.
- [orders.controller.ts](../../../../apps/api/src/modules/orders/orders.controller.ts) — protected `POST /api/v1/orders`, `GET /api/v1/orders`, and `GET /api/v1/orders/:id` routes.
- [orders.dto.ts](../../../../apps/api/src/modules/orders/orders.dto.ts) — strict request/query validation, including DEMO request identity and time windows.
- [orders.service.ts](../../../../apps/api/src/modules/orders/orders.service.ts) — outlet scoping, cutoff/intake-run selection, distinct order creation, duplicate retry handling, and detail authorization.
- [orders.service.test.ts](../../../../apps/api/test/orders.service.test.ts) — focused service coverage for domain rules.
- [app.module.ts](../../../../apps/api/src/app.module.ts) — registered OrdersModule.

## Upstream Artifacts Consumed
- `.github/modernize/rearchitecture/clarification.md` — preserved NestJS/Prisma/JWT architecture, outlet-scoped Store access, DEMO-only data, and API contract rules.
- `.github/modernize/rearchitecture/artifacts/t1-dba.md` — consumed `IntakeRun`, cutoff, order metadata, and migration contract.
- `docs/design-baseline/04-screens-dispatcher.md#D02-D03` — confirmed queue/detail fields, cutoff eligibility, and distinct order rows.
- `docs/design-baseline/07-screens-store.md#M02-M03` — confirmed order form, authoritative server cutoff, stable confirmation identity, and no scheduling promise.
- `docs/design-baseline/08-states-and-flows.md#1-Order model` — preserved confirmed demand as distinct from planned/delivered/receipt states.

## Evidence Mapping
- `clarification.md#Backend` → OrdersModule uses existing NestJS modular monolith, JWT guards, and Prisma service.
- `t1-dba.md#Deliverables` → service queries `IntakeRun` and writes the additive Phase 5 Order metadata.
- `07-screens-store.md#M02-M03` → `CreateOrderDto`, server cutoff selection, stable `DEMO-ORDER-*` reference generation, and repeat-request idempotency.
- `04-screens-dispatcher.md#D02` → list/detail routes expose intake-run association and preserve separate order identities.
- `08-states-and-flows.md#Durability and conflict specification` → duplicate request retries return the existing record and do not create a second order.

## API Contract
- `POST /api/v1/orders` — Store Manager only; requires `requestedDeliveryDate`, `temperature`, positive `units`, nonnegative `weightKg`/`volumeM3`, optional `HH:mm` window/access fields, and optional `DEMO-*` `sourceId`; returns a confirmed order with outlet, brand, and intake-run context.
- `GET /api/v1/orders` — Dispatcher sees all orders; Store Manager sees only the authorized outlet; optional requested-date filter.
- `GET /api/v1/orders/:id` — Dispatcher sees the order; Store Manager receives not-found semantics for other outlets.
- Unauthenticated requests are rejected by the existing JWT guard with HTTP 401.
- No route claims that an order is scheduled or delivered; planning and execution remain later phases.

## Domain Rules
- Only the authenticated Store Manager outlet can create or view its order records.
- Requested delivery date remains unchanged when the next eligible open intake run is selected.
- The selected run must be open, have a delivery date on or after the requested date, and have a cutoff after the server time; no eligible run returns a conflict.
- Reversed time windows are rejected; quantities retain decimal planning precision.
- Generated and caller-provided request identities are `DEMO-*`; no official dataset identifiers are accepted or introduced.
- Repeating a request with the same `DEMO-*` source identity and date returns the existing order for the same outlet.

## Test Results
- Command: `pnpm --filter @waypoint/api test`
- Passed: 13
- Failed: 0
- Skipped: 0
- Command: `pnpm --filter @waypoint/api db:check`
- Result: Passed; Prisma generation, API build, and PostgreSQL connectivity OK.
- Command: `pnpm lint`
- Result: Passed.
- Command: `pnpm typecheck`
- Result: Passed across shared, UI, API, and web packages.
- Command: `pnpm build`
- Result: Passed; existing Vite chunk-size and dependency annotation warnings only.
- Command: `pnpm exec prettier --check apps/api/src/modules/orders apps/api/test/orders.service.test.ts apps/api/test/health.test.ts apps/api/src/app.module.ts`
- Result: Passed.
- Command: `pnpm format:check`
- Result: Failed on 65 pre-existing repository files; touched Phase 5 files pass the focused check and unrelated files were not reformatted.
- Runtime probe: `curl.exe -sS -i http://127.0.0.1:3001/api/v1/orders`
- Result: HTTP 401 with `Authentication is required.`; Nest startup logs mapped all three ordering routes. Temporary host API processes were stopped after probing.

## Status
Complete for t2 backend scope. No official competition records or datasets were accessed, added, committed, uploaded, or exposed. The Phase 5 frontend and tester gates remain downstream.

## Findings and Risks
- Existing root formatting debt remains outside this task and should be handled separately rather than mixed into Phase 5.
- Order creation requires an already-open eligible intake run; run provisioning and planning publication are intentionally deferred to later phases.
