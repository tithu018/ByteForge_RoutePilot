# Shared screen specifications

Apply the design-system contracts in document 02. All layouts and state names are DD. A field marked not applicable has an explicit reason; it is not omitted coverage.

## S01 — Sign in

- **SCREEN ID:** S01
- **SCREEN NAME:** Sign in
- **ROLE:** All four roles; role is established by account, not selected to bypass permissions.
- **PURPOSE:** Enter the correct operational workspace.
- **PRIMARY USER DECISION:** Which authorized account to use.
- **INFORMATION SHOWN:** Product wordmark; `Waypoint Group`; `Sign in to delivery operations`; account/email and password labels; show-password control; persistent error region. Judge credentials belong in approved README/submission instructions, not an unrestricted account-switch UI.
- **COMPONENTS:** Centered 400px form on neutral canvas; product identity above; no promotional illustration; field error summary; primary `Sign in`.
- **PRIMARY ACTIONS:** Submit credentials; route to role home after success.
- **SECONDARY ACTIONS:** Show/hide password; return to an existing permitted workspace if already authenticated. Password-reset service is outside baseline; show support route only if provided.
- **VALIDATION:** Required identifier/password; no claim about password correctness before server response; avoid revealing whether an account exists.
- **ERROR STATES:** `We couldn't sign you in. Check your details and try again.` Connection failure: `Sign-in needs a connection. Your saved field work is still on this device.`
- **EMPTY STATES:** Blank form is the intended entry state; no fake demo metrics.
- **LOADING STATES:** `Signing in…`; prevent duplicate submit; retain fields on failure, avoid displaying password elsewhere.
- **RESPONSIVE BEHAVIOR:** Desktop centered form; phone 16px gutters, no full-height clipping when keyboard opens; password action 44px target.
- **DATA SOURCE:** Authentication result and permitted user/role context; no implementation exists yet.
- **WHAT OTHER ROLE IS AFFECTED:** None directly; routes user to the authorized scope.
- **RATIONALE PARAGRAPH:** Entry should establish identity without distracting from operational work. A short labelled form and explicit connection behavior support shared warehouse devices and personal driver phones. Account-derived routing protects the distinction between the four responsibilities and avoids a prototype shortcut that would later undermine access control.

## S02 — Session recovery

- **SCREEN ID:** S02
- **SCREEN NAME:** Session recovery
- **ROLE:** All; special driver pending-work variant.
- **PURPOSE:** Restore server access without discarding work.
- **PRIMARY USER DECISION:** Reauthenticate now or continue permitted cached field work until connected.
- **INFORMATION SHOWN:** `Your session has expired`; active account; count of locally saved actions if present; `Your saved actions will remain on this device`; connection state; no sensitive payload preview outside the authorized local context.
- **COMPONENTS:** Inline recovery panel over preserved context, or full page after navigation; `Sign in again`; driver `View saved trip` when allowed by the approved offline-session policy.
- **PRIMARY ACTIONS:** Reauthenticate the same identity and resume pending action/sync.
- **SECONDARY ACTIONS:** Return to cached trip; inspect pending count. Switching account invokes protected handoff, never uploads one user's events as another.
- **VALIDATION:** Recovered identity must own pending events; authorization rechecked at sync; policy for offline session duration remains an explicit decision.
- **ERROR STATES:** Wrong identity: `These saved actions belong to another account. Sign in with the original account.` Authentication failure stays within recovery.
- **EMPTY STATES:** No local work: standard sign-in recovery with return destination.
- **LOADING STATES:** `Restoring session…`; pending records remain unchanged.
- **RESPONSIVE BEHAVIOR:** Full-width phone recovery view; no tiny centered modal; preserve form/scroll context after return.
- **DATA SOURCE:** Session state, local pending-event summary and requested destination.
- **WHAT OTHER ROLE IS AFFECTED:** Dispatcher/Store updates wait until authorized sync resumes; no premature completion notification.
- **RATIONALE PARAGRAPH:** Session expiry must not become data loss. This screen tells field users what remains safe, distinguishes authentication from network recovery and prevents an apparently convenient account switch from misattributing delivery records. The interaction retains continuity while keeping the security policy explicit.

## S03 — Access denied

- **SCREEN ID:** S03
- **SCREEN NAME:** Access denied
- **ROLE:** All.
- **PURPOSE:** Explain an unavailable permission without exposing unauthorized records.
- **PRIMARY USER DECISION:** Return to permitted work or ask the responsible person for help.
- **INFORMATION SHOWN:** `You don't have access to this page`; signed-in role; generic permission explanation; home destination. Do not reveal another outlet's name/order details.
- **COMPONENTS:** Compact message panel, lock icon, `Go to my workspace`, optional support reference.
- **PRIMARY ACTIONS:** Return to role home.
- **SECONDARY ACTIONS:** Back; sign out after pending-work protection if appropriate.
- **VALIDATION:** Never render unauthorized cached detail before resolving scope.
- **ERROR STATES:** If home also fails, show S04 service-unavailable variant.
- **EMPTY STATES:** Not applicable: the intentional content is the permission explanation.
- **LOADING STATES:** Brief permission check skeleton; no flash of restricted page.
- **RESPONSIVE BEHAVIOR:** One-column layout at all sizes; target sizes remain accessible.
- **DATA SOURCE:** Authorization result, current role and allowed home route.
- **WHAT OTHER ROLE IS AFFECTED:** None; no mutation or request to other users is sent automatically.
- **RATIONALE PARAGRAPH:** A permission error should leave the user with a useful next step while revealing as little as possible about protected records. Keeping the page short and specific avoids confusing operational failures with missing data, and preserves the role boundaries needed for a credible four-role demonstration.

## S04 — Unavailable / not found

- **SCREEN ID:** S04
- **SCREEN NAME:** Unavailable / not found
- **ROLE:** All.
- **PURPOSE:** Recover from service failure, stale links or unavailable records.
- **PRIMARY USER DECISION:** Retry, return to the list or open a saved trip.
- **INFORMATION SHOWN:** Separate variants: `We couldn't load this page` (service error); `This record is no longer available` (known missing); `This page wasn't found` (route); `Not downloaded for offline use` (driver cache miss). Include last successful refresh only if known.
- **COMPONENTS:** Contextual error panel; retry/home actions; optional diagnostic reference; cached-data notice where relevant.
- **PRIMARY ACTIONS:** Retry for transient errors; return to source list for missing record.
- **SECONDARY ACTIONS:** Driver opens available cached trip; copy support reference.
- **VALIDATION:** Retry cannot create a mutation; never describe a failed read as no records.
- **ERROR STATES:** Repeated failure leaves visible error and preserved work; no endless spinner or automatic retry storm.
- **EMPTY STATES:** True empty business states belong to their screen, not S04.
- **LOADING STATES:** Retain message while retrying; `Trying again…` and cancel/return remain available.
- **RESPONSIVE BEHAVIOR:** Compact full-width phone panel; no illustration that pushes recovery below fold.
- **DATA SOURCE:** Navigation/read failure, cache availability, last successful snapshot.
- **WHAT OTHER ROLE IS AFFECTED:** None until the user successfully resumes a workflow.
- **RATIONALE PARAGRAPH:** Not-found, unavailable and uncached are different problems requiring different actions. Clear variants prevent users from treating an outage as an empty workload or believing an uncached stop is available offline. The screen emphasizes retained work and recovery rather than decorative error graphics.
