# Approved design baseline and implementation handoff

The user approved Phase 1 before authorizing Phase 2. The original [Design Baseline DB-0.1](../design-baseline/README.md) is preserved as the specification snapshot; its original review-status text is historical. This page records current approval without rewriting the original artifact.

Implemented foundation: light neutral surfaces, deep navy navigation, blue accent, locally bundled Inter, 8px-based spacing, explicit placeholder states, accessible shared primitives and responsive role shells. Field pages reserve mobile navigation and the Driver connection-status location. There are no invented workload counts or analytics.

Development-only adaptation: an explicitly labelled preview selector makes four unauthenticated shell routes inspectable. It is not the future operational account-switching model and must be replaced/restricted when authentication is implemented. `/foundation` contains component examples with labelled sample values, not business records.

The implementation now continues through Phase 3 with Prisma inside the API workspace; this refines the earlier conceptual root-level folder proposal without changing the modular-monolith architecture. The Phase 3 schema adds domain persistence but does not change approved screen flows. High-fidelity Designathon prototype/export/video remain separate submission work; a running shell does not substitute for them.

## Significant departures register

No business behavior departure has been implemented. Future changes to submitted screen flows, evidence formats or state models must record the change, reason, affected screens and reviewer approval here and in the root README.

## User-requested UI refresh

The user requested a more polished, interactive template. The application now uses teal actions, an ink navigation sidebar, a split login layout, stronger typography, and rounded work panels. These are presentation decisions departing from the original blue accent and login composition; the original baseline remains preserved. Added interactions include password visibility, sidebar collapse, and local order search/status filtering. Existing API behavior and competition rules are unchanged. Workflow artwork is conceptual, and dashboard counts remain sourced from the API.

## Reference-based Control Tower interface (27 September 2026)

The user explicitly replaced the earlier visual direction with eight supplied Waypoint Control Tower reference images. This authorizes the blue/navy palette, photographic truck and store banners, geometric Waypoint wordmark, angled login backdrop, soft panel shadows, and reference screen compositions. The original `docs/design-baseline` specification is preserved unchanged.

Implemented compositions: public landing page at `/`, login at `/login`, six-metric dispatcher dashboard, three-column planning workspace, loader trip/checklist/table, mobile driver stop screen, driver sync queue/results, store dashboard with embedded order entry, and store order tracking. Existing role access remains in place. Planning validation/publishing and loading controls call the existing API; search, stop navigation, map zoom/layers, password visibility, remembered email, order download/share/print, and access-help dialogs are interactive.

The reference is a visual specification, not a source of operating rules or business evidence. Sample US addresses, promotional KPIs, customer endorsements, fabricated arrival times, product SKUs, and unsupported OAuth providers were not copied as actual project content. Metric positions remain, with counts from the API and descriptive project facts on public pages. Map panels preserve their place and proportions but show labelled route schematics: there are no GPS coordinates or live-map integration. The sign-in help buttons occupy the reference's secondary access area and explain administrator-assisted access. Local delivery queue support remains a limited existing demo workflow, not complete offline trip caching or automatic synchronization.

New local artwork was produced with the built-in image generation tool. See [asset files and exact prompts](reference-assets.md). No competition datasets were sent to any image service.

Verification: repository lint, type checking, API/frontend tests, and production build; Playwright visual checks at desktop and phone sizes using the existing synthetic test fixture, plus live local demo-account sign-in and operations API checks. Screenshots used for development live in the local temporary directory and are not competition evidence.
