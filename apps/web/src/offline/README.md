# Offline boundary — deferred

The approved Driver offline flow is in `docs/design-baseline/08-states-and-flows.md`.
This directory reserves the future Workbox app shell, Dexie bundle/outbox and recovery boundary.
No service worker is registered in Phase 2: the shell must not imply cached trips or safe offline recording.
Browser connectivity is only a hint; API availability is checked independently on the foundation page.
