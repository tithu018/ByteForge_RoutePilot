## [t4] Phase 5 ordering gate

- Codebase/domain discoveries: ordering tests already cover confirmation, DEMO request idempotency, cutoff eligibility, reversed windows, outlet detail scope, and accessible form fields.
- Wrong assumptions and corrections: port 3000 was already occupied by another process; the temporary API was isolated on port 3002 before runtime conclusions were made.
- Debugging dead-ends and what actually worked: the initial 3001 probe was invalid because `.env.example` configures port 3000; the isolated port probe gave the authoritative result.
- Techniques/patterns worth reusing: validate protected routes without credentials first, then distinguish route registration from database-backed authenticated flows; use focused Prettier checks when repository-wide formatting has existing debt.
- Learnings consumed: none
