# Ordering Intake Contract

Phase 5 ordering keeps server cutoff selection and outlet authorization in the NestJS service layer.

## What Happened
The existing Prisma migration added `IntakeRun` and order intake metadata, while auth already exposed Store Manager `outletId`. The API therefore uses a Store-only create route, selects the first open run at or after the requested date whose cutoff is still open, and keeps the requested date unchanged. Request identities are `DEMO-*` and repeated identities return the existing order.

## Takeaway
Keep ordering eligibility and resource scoping out of controllers. Use runtime imports for Nest constructor-injected classes even when TypeScript sees them only as types; the repository lint convention is an eslint-disable comment for those imports.

## History
- 2026-09-26 (RootCode/t2): initial
