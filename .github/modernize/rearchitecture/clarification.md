---
schema: clarification/v1
generated_at: "2026-09-26T10:34:00Z"
scope:
  - frontend
  - backend
  - generic
clarity_score: 1.00
rounds: 1
gaps: []
blocking_gaps: []
---

# Scenario Clarification

## Frontend

- **Target framework**: Preserve the existing React and Vite versions.
- **Component library**: Preserve the existing shared UI package and shadcn/ui-compatible Radix primitives.
- **Screenshots**: Use the approved Phase 1 Design Baseline, current repository UI, design documentation, and stored project prototypes or screenshots; the approved specification takes priority on conflict.
- **Design system**: Use `docs/design-baseline` and the existing shared UI package and design tokens.
- **Accessibility**: WCAG 2.1 AA.
- **Browser targets**: Current Chrome, Edge, Firefox, Safari, mobile Chrome/Android, and Safari/iOS; prioritize Chromium judge environments without browser-specific implementations.
- **Responsive strategy**: Preserve role-specific responsive behavior and existing Tailwind breakpoints; Dispatcher desktop-first, Loader tablet/mobile optimized, Driver mobile-first, and Store Manager mobile and desktop.
- **i18n locales**: English only; keep strings structured for future localization.
- **State management**: TanStack Query for server state, React local state or `useReducer` for local UI state, React Hook Form for forms, and Dexie/IndexedDB for driver offline persistence; do not add Redux without a verified requirement.
- **Routing**: Preserve React Router, protected routes, role-aware navigation, and the current role-based URL structure.

## Backend

- **Target framework**: Preserve the existing NestJS modular monolith and version.
- **API contract preservation**: Preserve implemented Phase 1-4 routes, payloads, and status behavior; add Phase 5-15 endpoints consistently and document any justified breaking correction.
- **Data migration strategy**: Evolve the existing PostgreSQL schema in place with incremental Prisma migrations; preserve migration history and verify fresh-database migration.
- **Auth framework**: Preserve JWT authentication, secure password hashing, RBAC, protected routes, and resource-scoped authorization.
- **SLA targets**: No formal SLA; avoid regressions, keep interactive operations responsive, bound large-list queries, and support phone-sized field devices.

## Generic

- **Success definition**: Implement and verify all implementable Phase 5-15 competition requirements, including ordering, planning, loading, delivery, receipt, offline synchronization, operational views, authorization, persistence, responsive field flows, tests, Docker startup, judge walkthrough, required documentation, deployment-ready configuration, and locally runnable Datathon tooling when authorized data is supplied.
- **Out of scope**: Rewriting valid Phase 1-4 work; architecture replacement; unnecessary infrastructure; native apps; unrequired GPS or live maps; invented rules; mandatory photo/signature POD; mandatory Datathon model integration; unauthorized dataset handling or external submission actions.
- **Existing test posture**: Existing formatting, lint, typecheck, tests, and builds must continue to pass; add relevant tests for new work and do not weaken valid coverage.
- **Output location**: Continue in place in the existing workspace from the Phase 4 repository.
- **Additional constraints**: Preserve the approved baseline and distinguish official requirements, design decisions, optional enhancements, and Datathon-only rules. Use only clearly labelled `DEMO-*` synthetic development data. Driver offline work must persist through reload and reconcile after connectivity returns. Driver completion and store receipt remain separate, and planning `SERVED` is not actual `DELIVERED`. External credentials, confidential datasets, public deployment, prototype sharing, video uploads, and submission forms remain external actions or blocked until authorized.

## Gaps & Defaults Applied

None. All required clarification decisions are resolved by the submitted answers.

## Downstream Usage Notes

- Continue sequentially from Phase 5 through Phase 15 without recreating or discarding existing work.
- Treat `docs/design-baseline` and verified competition requirements as the source of truth.
- Report incomplete work, blockers, and external actions honestly; never represent synthetic data or unexecuted validation as official evidence.