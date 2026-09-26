## [t1] Phase 5 ordering persistence

- Codebase/domain discoveries: Phase 4 already had core `Order`, `Plan`, `Deferral`, and trip persistence, but no intake-run boundary or order intake metadata.
- Wrong assumptions and corrections: the first seed update was empty, which would leave an existing demo order disconnected from the new intake run; the upsert now backfills the relation and fields idempotently.
- Debugging dead-ends and what actually worked: repository Prettier cannot parse Prisma schema or SQL and reports broad pre-existing formatting drift; targeted TypeScript formatting plus executable gates provided useful validation.
- Techniques/patterns worth reusing: additive Prisma migrations with nullable order metadata and `RESTRICT` foreign keys preserve old rows while preventing silent history deletion.
- Learnings consumed: [(none)]

## [t5] Phase 6 capacity planning data model

- Codebase/domain discoveries: Existing `Plan`, `Trip` and `Vehicle` rows provide the planning foundation, while D03/D05/D10/D11 require durable validation history, review-time vehicle facts and future-capacity provenance.
- Wrong assumptions and corrections: Prisma's migration diff requires a configured shadow database, so local migration deployment and repeated seed execution were used as the executable migration evidence instead.
- Debugging dead-ends and what actually worked: Repository Prettier cannot parse Prisma or SQL; the TypeScript seed formatted cleanly and Prisma validation/generation plus PostgreSQL migration checks were authoritative for touched data-layer files.
- Techniques/patterns worth reusing: additive restrictive relations and database non-negative/chilled-volume checks protect history and numerical invariants while leaving feasibility policy in services.
- Learnings consumed: [dba/additive-ordering-migration]
