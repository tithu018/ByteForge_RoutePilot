# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm monorepo with a React/Vite browser application and a NestJS modular monolith. `packages/shared` holds runtime-validated transport contracts; build it before consumers. `packages/ui` exports reusable React primitives and CSS tokens; feature-specific UI belongs in the web application. Prisma configuration and migration history live inside `apps/api`, not at the repository root. Database access belongs in services, never controllers.

## Approved Scope and Data

Follow the verified Tech-Triathlon requirements and preserve `docs/design-baseline`. Clearly distinguish official rules from design decisions; never invent competition requirements. Phase 2 implements foundation only. Unimplemented module directories and role routes are placeholders, not completed workflows or authentication. Keep allocation rules in dedicated domain services and business logic out of React components when those phases are authorized. Driver offline support is mandatory and belongs to a dedicated later phase; a connection badge is not offline support.

Never commit competition datasets or derivatives. Never upload them to third-party services, including private hosting, without confirmed authorization. Do not introduce Kafka, Redis, Kubernetes, queues or microservices without an approved requirement. Document significant departures from the Designathon baseline in `docs/design/README.md` and the root README.

## Build, Test, and Development Commands

Use Node 22 and pnpm 10.28.2. Copy `.env.example` to `.env`. `docker compose up` starts the full built stack; `pnpm dev` starts host hot-reload servers after PostgreSQL and migrations are ready. Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` for foundation changes. Database commands are `pnpm db:generate`, `pnpm db:migrate`, and `pnpm db:check`. Test a frontend file with `pnpm --filter @waypoint/web test src/test/shell.test.tsx`. `pnpm test:e2e` expects running services.

## Coding Style and Testing

Strict TypeScript includes unchecked-index checks. ESLint prohibits explicit `any`; Prettier uses single quotes and a 100-column limit. Use type-only imports, small modules and typed API responses. Preserve accessible native/Radix behavior. Vitest covers frontend smoke tests; the Node test runner with Nest TestingModule covers API infrastructure. Playwright checks desktop/phone shells and live connectivity. Run relevant checks after changes; never report placeholders, simulated data or unexecuted verification as complete.
