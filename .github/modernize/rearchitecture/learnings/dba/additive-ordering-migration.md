# Additive Ordering Migration

Use an additive intake-run relation and nullable order metadata when extending the existing ordering schema.

## What Happened
For t1, Phase 4 already persisted orders and deferral history but lacked the `IntakeRun` boundary required by D02/M02. A new `IntakeRun` model, explicit indexes, `RESTRICT` foreign keys, and nullable order intake fields were added in one Prisma migration. The synthetic seed was made idempotent for both new and existing `DEMO-*` rows.

## Takeaway
Keep intake provenance separate from mutable order lifecycle state. Use Prisma's migration ledger for repeat-deploy safety, and make seed upserts update newly introduced fields so existing demo rows exercise the new relations.

## History
- 2026-09-26 (RootCode/t1): initial
