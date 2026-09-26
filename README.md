# <SOLUTION_NAME> — Waypoint delivery operations

Tech-Triathlon 2026 · `<TEAM_NAME>_<SOLUTION_NAME>`

A connected delivery platform for Waypoint Group's Dispatcher, Loader, Driver and Store Manager. The approved [Phase 1 Design Baseline](docs/design-baseline/README.md) is the implementation reference.

**Current scope: Phase 2 project foundation. Business functionality has not yet been implemented.** Workspace routes are explicit development previews. There is no authentication, operational data, allocation, delivery recording or offline synchronization yet. This is not the completed competition submission or a completed high-fidelity Designathon artifact.

## Architecture

- React/Vite web app → versioned NestJS REST modular monolith → Prisma/PostgreSQL.
- `packages/shared`: runtime-validated health contracts and shared types; no server internals.
- `packages/ui`: reusable accessible primitives using Radix, semantic HTML and approved visual tokens.
- Browser calls `/api/v1` through Vite's development proxy or the container web server. Internal service addresses and secrets never enter the browser bundle.
- Docker runs the built web app and API with a persistent PostgreSQL volume. Future offline work has a documented boundary, not a falsely active service worker.

See [architecture](docs/architecture/README.md), [database foundation](docs/data-model/README.md) and [design handoff](docs/design/README.md).

## Technology

Node 22, pnpm 10.28.2, strict TypeScript 5.9, React 19, Vite 7, Tailwind 4, Radix/shadcn-compatible UI, React Router, TanStack Query, React Hook Form, Zod, Lucide, NestJS 11, Prisma 7, PostgreSQL 17, Vitest, Node test runner/Nest TestingModule, Playwright, ESLint and Prettier. Exact resolved versions are locked in `pnpm-lock.yaml`.

## Repository

```text
apps/web/                 React shell, role previews, component lab, future offline boundary
apps/api/                 Nest modules, API conventions, Prisma config/schema/migrations
packages/shared/          Shared contracts; built before consuming workspaces
packages/ui/              UI primitives and design tokens
docs/design-baseline/     Original approved Phase 1 specification
docs/architecture/       Foundation architecture and conventions
docs/data-model/         Current empty schema and future domain boundary
docs/design/             Baseline handoff and design decisions
scripts/                 Service readiness helper
tests/e2e/               Browser smoke tests
.github/workflows/       CI checks; no automatic deployment
```

## Prerequisites

**Docker path:** Docker Engine/Desktop running with Linux containers and Compose v2+; Git. Node/pnpm are not required on the host just to run Docker.

**Host development:** Node **22.14 or later in the 22.x line**, pnpm **10.28.2**, and PostgreSQL (the provided Docker service is recommended).

```sh
npm install --global pnpm@10.28.2
```

Alternatively enable Corepack and let `packageManager` select pnpm. The plain `pnpm` command must be on PATH, including for workspace scripts. On Windows, open a fresh terminal if a global installation has changed PATH.

## Environment setup

From the repository root:

```sh
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

The supplied credentials are **local-only examples**, not production secrets. `.env` is ignored by Git and Docker build context. The default PostgreSQL host port is **55432**, avoiding common local/reserved 5432 conflicts. If changing credentials or ports, update the host `DATABASE_URL` to match. Use URL-safe credentials or correctly encoded URL values; the default Compose interpolation assumes URL-safe values.

| Variable | Purpose / default |
|---|---|
| `NODE_ENV` | Host runtime mode, `development`; built API container uses `production` |
| `API_PORT` | Host API port, `3000`; container listens internally on 3000 |
| `WEB_PORT` | Host web/Vite port, `5173`; web container listens on 8080 internally |
| `POSTGRES_PORT` | Host PostgreSQL port, `55432`; container port 5432 |
| `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` | Local database configuration |
| `DATABASE_URL` | Host API/Prisma connection string; Compose constructs its internal `postgres` service URL separately |
| `VITE_API_BASE_URL` | Public browser API path, `/api/v1`; never a secret |
| `API_BASE_URL` | Vite proxy upstream, `http://localhost:3000`; server-side config only |
| `CORS_ORIGINS` | Comma-separated exact origins, default `http://localhost:5173`; no wildcard or trailing path |
| `JWT_SECRET` | Reserved placeholder only; unused until authentication phase |

If changing `WEB_PORT`, update `CORS_ORIGINS` as appropriate. If changing `API_PORT` for host development, update `API_BASE_URL`. Existing PostgreSQL volumes retain their original database/user credentials: editing environment values does not rotate an initialized database password.

## Docker startup — recommended first run

```sh
docker compose up
```

First startup builds images, starts PostgreSQL, applies the empty baseline migration, waits for API readiness and serves the web app. No dataset download or seed is required in this phase. Later phases must extend seeding to meet the final competition requirement.

- Web: **http://localhost:5173**
- API liveness: **http://localhost:3000/api/v1/health** → `{"status":"ok"}`
- Database readiness: **http://localhost:3000/api/v1/health/ready** → `{"status":"ok","database":"connected"}`
- Browser-to-API verification: **http://localhost:5173/foundation**

```sh
docker compose ps
docker compose logs api
docker compose up --build    # rebuild after source changes; no bind-mounted hot reload
docker compose down         # keeps PostgreSQL data
```

All published ports bind to localhost. This Compose stack is for local development/review, not an authorized public deployment. Do not expose it publicly before authentication, hosting/data permissions and production settings are addressed.

## Local development with hot reload

Stop the `web` and `api` containers first if using the same host ports, then:

```sh
pnpm install --frozen-lockfile
docker compose up -d postgres
pnpm db:generate
pnpm db:migrate
pnpm dev
```

`pnpm dev` builds/watches shared contracts, generates Prisma, watches the API with TypeScript decorator metadata, and starts Vite. Do not run host servers and the full Compose stack on the same ports simultaneously.

## Commands and verification

| Command | What it does |
|---|---|
| `pnpm dev` | Shared/API/web development processes |
| `pnpm build` | Prisma generation, shared/UI declarations, API compilation and web production bundle |
| `pnpm lint` | ESLint, zero warnings |
| `pnpm typecheck` | Generate prerequisites and strict-check all workspaces |
| `pnpm test` | API infrastructure and frontend smoke tests; no external DB required |
| `pnpm test:e2e` | Browser smoke tests against an already running complete stack |
| `pnpm format:check` / `pnpm format` | Check/write formatting; historical Phase 1 documents excluded |
| `pnpm db:generate` | Generate Prisma client; no database mutation |
| `pnpm db:migrate` | Deploy committed migrations |
| `pnpm db:migrate:dev -- --name <change>` | Author a future approved schema migration; inspect changes before commit |
| `pnpm db:studio` | Inspect local database |
| `pnpm db:check` | Compile and run a real Prisma `SELECT 1` connectivity check |

Single test: `pnpm --filter @waypoint/web test src/test/shell.test.tsx` or `pnpm exec playwright test --grep "dialog"`.

For browser testing:

```sh
pnpm exec playwright install chromium
# Start the complete stack first.
pnpm test:e2e
```

Local Playwright is headed; CI is headless. Tests cover desktop and phone contexts. `E2E_BASE_URL` can target a different port; output is in ignored `playwright-report/` and `test-results/`. CI also starts real PostgreSQL, applies the baseline and verifies connectivity. It does not deploy publicly.

## Current routes

| Route | Current behavior |
|---|---|
| `/` | Redirect to `/dispatcher` |
| `/dispatcher` | Desktop operations shell |
| `/dispatcher/orders`, `/planning`, `/fleet`, `/deliveries`, `/deferrals`, `/exceptions`, `/capacity` | Each suffix under `/dispatcher`; labelled placeholders |
| `/loader`, `/loader/active`, `/loader/issues` | Tablet/phone warehouse shell |
| `/driver`, `/driver/trip`, `/driver/sync` | Mobile shell and connectivity reservation; **no offline storage/sync** |
| `/store`, `/store/orders`, `/store/create`, `/store/issues` | Simple store shell; **no order form/workflow** |
| `/foundation` | Real health checks and clearly labelled component examples |
| `/access-denied` | Access-denied UI placeholder, not active RBAC |
| Unknown routes | Not-found page |

The account menu is explicitly a **development preview selector**, not authentication or impersonation. No accounts are seeded yet; the four required judge accounts belong to the authentication/seed phases.

## Phase roadmap

1. Design Baseline — approved specification; visual Designathon prototype/video remain separate deliverables.
2. Foundation — this scope: workspace, infrastructure, shared primitives, checks and documentation.
3. **Recommended next: authentication and scoped role access**, with only the necessary approved identity schema, four development/judge accounts, login/session handling and route/API guards. No operational workflows without further phase approval.
4. Subsequent approved phases: domain/reference data, orders/intake, planning/validation/deferrals, loading, driver delivery/receipt, dedicated offline reconciliation, operations/forecast presentation and competition packaging. Datathon remains separate.

Do not import, commit or transmit competition datasets in this phase. Record significant later deviations from the submitted Designathon design in [the design handoff](docs/design/README.md). See [AI disclosure](docs/ai-disclosure.md).
