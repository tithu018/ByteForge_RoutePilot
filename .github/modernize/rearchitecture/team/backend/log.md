## t2 Phase 5 ordering APIs
- Codebase/domain discoveries: auth already provides Store Manager outlet scope; t1 added IntakeRun cutoff/order metadata; orders module was otherwise empty.
- Wrong assumptions and corrections: the isolated HealthModule test must continue expecting `/orders` 404; actual AppModule runtime probe correctly returns 401 without JWT.
- Debugging dead-ends and what worked: port 3000 was also proxied by Docker, so the host API was verified on temporary port 3001; emitted Nest startup logs confirmed all order routes.
- Techniques/patterns worth reusing: keep cutoff, outlet scoping, and idempotency in the service; preserve Nest runtime imports with the local eslint exception; use focused Prettier checks when repository-wide formatting debt is pre-existing.
- Learnings consumed: [none]

## t6 Phase 6 capacity planning services
- Codebase/domain discoveries: planning was still a placeholder; the Phase 6 schema is sufficient to validate current plan decisions, trips, allocations and vehicle capabilities without an optimizer.
- Wrong assumptions and corrections: the initial oversized-order test changed only the queue result, not the trip allocation; capacity validation correctly used the allocation facts, so the fixture was corrected.
- Debugging dead-ends and what worked: Prisma's nullable compound unique input rejected `brandId: null`; a separate brand-less find/update/create path preserved correct null semantics.
- Techniques/patterns worth reusing: keep missing route distance as an advisory fuel-estimate state; use the established Nest runtime-import ESLint exception for constructor injection; validate before publication and persist validation/snapshot evidence.
- Learnings consumed: [backend/phase6-capacity-evidence]
