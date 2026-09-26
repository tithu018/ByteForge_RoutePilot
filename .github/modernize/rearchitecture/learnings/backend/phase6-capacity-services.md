# Phase 6 capacity services

- Keep plan validation as a server-side projection over current decisions, trips, allocations and vehicle facts; do not invent an optimizer or route distance when source data is absent.
- Prisma compound unique inputs may reject nullable fields at the TypeScript boundary; use a separate find/update/create path for brand-less capacity scenarios to preserve null semantics.
- Nest constructor dependencies that are runtime-injected may trigger `consistent-type-imports`; preserve value imports with the existing local ESLint disable pattern rather than converting them to type-only imports.
