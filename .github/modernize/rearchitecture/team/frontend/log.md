## [t3] Implement Phase 5 ordering workflows
- Codebase/domain discoveries: Store routes were still shell placeholders; backend exposes Store Manager-only create plus scoped list/detail routes under `/api/v1/orders`.
- Wrong assumptions and corrections: The create page initially used `useQueryClient` during render, which made its standalone test require a provider; invalidation now uses the existing app singleton while the test wraps mutation context explicitly.
- Debugging dead-ends and what actually worked: Required-label assertions include the visual required marker, so regex label matching is needed in Testing Library.
- Techniques/patterns worth reusing for future tasks: Keep confirmation explicit and never infer scheduling from accepted order data; use only client-generated `DEMO-*` identities.
- Learnings consumed: [backend/ordering-intake-contract, dba/additive-ordering-migration]
