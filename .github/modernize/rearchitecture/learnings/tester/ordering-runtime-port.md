# Ordering Runtime Port Validation

Runtime probes must target an isolated configured API port when another local process may already own the default port.

## What Happened

Phase 5 task t4 first probed port 3001, which was not configured, then port 3000, where an unrelated process returned 404 for ordering routes. The temporary Nest process was started with `API_PORT=3002`; liveness returned 200 and both protected ordering routes returned 401 as expected.

## Takeaway

Check port ownership before treating a runtime response as evidence. Prefer an unused port for temporary API validation and record authenticated database flows separately when infrastructure is unavailable.

## History

- 2026-09-26 (RootCode/t4): initial
