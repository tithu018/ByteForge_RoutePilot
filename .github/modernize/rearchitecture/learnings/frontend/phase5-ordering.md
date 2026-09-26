# Phase 5 Ordering Frontend

The Store Manager ordering UI uses typed API methods plus TanStack Query and keeps confirmation separate from scheduling.

## What Happened
Implemented RootCode/t3 using the existing React Router, shared UI primitives, and query client. Store routes now load API-backed history, submit only the backend-supported order fields, preserve a DEMO request identity for retries, and show `Scheduling pending` until later planning exists.

## Takeaway
Keep the create form and order history in a role-specific page module, but use the shared app query client for invalidation. In component tests, wrap mutation/query views with a fresh `QueryClientProvider`.

## History
- 2026-09-26 (RootCode/t3): initial
