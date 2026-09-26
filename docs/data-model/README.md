# Database foundation

The approved domain model is documented in the requirements verification and [Design Baseline](../design-baseline/08-states-and-flows.md). **No business schema is implemented in Phase 2.**

`apps/api/prisma/schema.prisma` contains the PostgreSQL datasource and client generator only. The baseline SQL migration executes `SELECT 1`; Prisma creates its own migration bookkeeping. There are no invented infrastructure columns, accounts, operational records, seeds or competition imports.

Prisma 7 uses `apps/api/prisma.config.ts` for CLI connection configuration and `@prisma/adapter-pg` in DatabaseService at runtime. `pnpm db:check` performs a real Prisma query; `/api/v1/health/ready` provides a safe service-level check. Generate the client with `pnpm db:generate` and apply committed migrations with `pnpm db:migrate`.

In a later approved phase, edit the schema, generate a named migration with the development command, inspect the SQL and commit migration history with the change. Do not use schema push/reset against existing data as an undocumented shortcut. Empty business schema is deliberate, not an incomplete seed failure.
