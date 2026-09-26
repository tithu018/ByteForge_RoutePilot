# Loader screen specifications

All Loader screens support phone-sized assessment as well as tablet/terminal use. Use 48–52px primary actions, no hover-only tools and persistent trip identity. The warehouse workflow is online-first; offline Driver support is not implied to make every Loader mutation available offline. Lost warehouse connectivity preserves form input and clearly blocks unconfirmed readiness.

## L01 — Assigned Loads

- **SCREEN ID:** L01
- **SCREEN NAME:** Assigned Loads
- **ROLE:** Loader.
- **PURPOSE:** Select the correct current loading job.
- **PRIMARY USER DECISION:** Which assigned trip needs loading next?
- **INFORMATION SHOWN:** User/depot, service date, assigned trips sorted by planned departure; trip ref/number, vehicle, departure, stop/order count, published version, loading progress, outstanding issues and changed-plan badge. Sorting must not move the selected job during interaction.
- **COMPONENTS:** Compact header; `Upcoming`/`In progress`/`Ready` filters; large job cards; no fleet-wide analytics.
- **PRIMARY ACTIONS:** `Open load` → L02.
- **SECONDARY ACTIONS:** Refresh; filter; inspect own identity/sign out through safe session flow.
- **VALIDATION:** Only authorized current assignments; superseded work clearly labelled; no draft Dispatcher plans appear as current loads.
- **ERROR STATES:** `Couldn't refresh assigned loads. Last updated <time>.` Existing view remains read-only if current state cannot be verified.
- **EMPTY STATES:** `No loads assigned for this date. Check with the Dispatcher.` No create-trip action for Loader.
- **LOADING STATES:** Three structural card placeholders; refresh preserves existing content.
- **RESPONSIVE BEHAVIOR:** Tablet two-column job cards where legible; phone single-column, critical identity/departure on first two lines; bottom nav does not cover last card.
- **DATA SOURCE:** Published TripAssignment, Trip, loading projection and PlanVersion.
- **WHAT OTHER ROLE IS AFFECTED:** Opening is read-only; later loading progress updates Dispatcher and readiness informs Driver.
- **RATIONALE PARAGRAPH:** A loader needs a reliable work queue rather than management statistics. Clear vehicle, departure and revision identity reduce the risk of opening the wrong printed-plan equivalent. Assignment-based access and stable ordering keep the interface usable on shared devices and during interrupted warehouse work.

## L02 — Load Checklist

- **SCREEN ID:** L02
- **SCREEN NAME:** Load Checklist
- **ROLE:** Loader.
- **PURPOSE:** Record loading against the current ordered plan.
- **PRIMARY USER DECISION:** Has each order's expected quantity been loaded, or must an exception be reported?
- **INFORMATION SHOWN:** Sticky trip/vehicle/version and departure; stop sequence; order/outlet refs; units, temp and relevant dock/access notes; expected/loaded quantity; `Unchecked/Loaded/Missing/Damaged/Short`; total progress and issue count. `Load to support this unloading order` is guidance; do not invent a universal physical reverse-loading algorithm.
- **COMPONENTS:** Tablet stop list + selected-order checklist; phone stacked expandable stop cards; quantity stepper/keypad; `Mark loaded`; persistent issue button; readiness footer.
- **PRIMARY ACTIONS:** Save loaded quantity; `Report problem` → L03; `Review readiness` → L06.
- **SECONDARY ACTIONS:** Inspect order/stop detail; amend own entry with visible correction history; open L05 when plan changes.
- **VALIDATION:** Quantity cannot be negative or exceed expected without explicit correction policy; full loaded marking must match expected units; critical unresolved issue prevents readiness per DD; stale version pauses affected confirmations.
- **ERROR STATES:** Failed save: `Loading update wasn't saved. Try again.` Retain input; plan changed banner opens L05; no silent successful checkbox on server failure.
- **EMPTY STATES:** Trip has no loading lines → `This plan has no assigned orders. Ask the Dispatcher to review.` No ready action.
- **LOADING STATES:** Checklist skeleton; per-line saving indicator; show confirmed progress separately from pending input.
- **RESPONSIVE BEHAVIOR:** Tablet split list/detail; phone one open card at a time without hiding summary; large quantity controls; sticky footer lifts above keyboard and safe area.
- **DATA SOURCE:** Published trip/stop/order snapshot, LoadingEvent and Issue.
- **WHAT OTHER ROLE IS AFFECTED:** Dispatcher sees progress/shortage; Driver sees readiness only after L06 accepted; Store schedule is not silently changed by a loading checkbox.
- **RATIONALE PARAGRAPH:** The checklist translates the plan into concrete warehouse work. It keeps sequence, quantities and exceptions together so a missing item can be reported at the point it is discovered. Truthful per-line save feedback and revision awareness prevent the fast interaction from creating a false readiness signal.

## L03 — Report Loading Exception

- **SCREEN ID:** L03
- **SCREEN NAME:** Report Loading Exception
- **ROLE:** Loader.
- **PURPOSE:** Capture a missing, damaged or short quantity before departure.
- **PRIMARY USER DECISION:** What is wrong, how much is affected and what must the Dispatcher know?
- **INFORMATION SHOWN:** Trip/vehicle/version, selected order/outlet, expected and already loaded units; type selector `Missing`, `Damaged`, `Short`; affected quantity; short description; proposed severity explanation. Photos are not baseline requirements.
- **COMPONENTS:** Full-screen phone form/tablet side panel; segmented exception type; quantity input; concise note; consequence preview `This issue will be visible to the Dispatcher`.
- **PRIMARY ACTIONS:** `Report loading issue`.
- **SECONDARY ACTIONS:** Cancel while retaining checklist state; return to order. Cancel with entered content asks whether to discard that unsent report.
- **VALIDATION:** Required type/order/affected quantity; positive affected quantity within expected amount; damaged units not double-counted as missing; if categories can overlap, require clarification rather than silently sum. Note required for unclear/other context.
- **ERROR STATES:** Save failure preserves all fields; changed plan prompts revalidation; connection failure says report has not reached Dispatcher.
- **EMPTY STATES:** No selected order → choose a checklist line; no valid lines blocks report and links back.
- **LOADING STATES:** `Reporting…`; duplicate tap prevented; uncertain response checked by request identity before resubmit.
- **RESPONSIVE BEHAVIOR:** Phone numeric keypad and visible context; keyboard does not cover submit/errors; tablet short form fits alongside checklist.
- **DATA SOURCE:** Current checklist context; submitted LoadingEvent/Issue outcome.
- **WHAT OTHER ROLE IS AFFECTED:** Dispatcher exception queue updates; Driver readiness shows a hold if issue is classified blocking; no automatic inventory or order-quantity rewrite.
- **RATIONALE PARAGRAPH:** Reporting should take little typing while preserving enough information to act. Tying the report to a specific order, quantity and plan version makes it more useful than a free-form message. The interface explicitly distinguishes reporting a problem from resolving it or changing the customer's confirmed order.

## L04 — Loading Issue Detail

- **SCREEN ID:** L04
- **SCREEN NAME:** Loading Issue Detail
- **ROLE:** Loader.
- **PURPOSE:** Track an exception and carry out an authorized correction.
- **PRIMARY USER DECISION:** Can the goods be rechecked/reloaded under the recorded corrective action, or is the trip still waiting?
- **INFORMATION SHOWN:** Issue ref/type/status, order and quantity, initial report time, Dispatcher acknowledgement/instruction, correction history, plan revision if applicable and readiness impact.
- **COMPONENTS:** Issue summary; ordered action timeline; linked checklist line; `Record recheck` action when available. Proposed issue severity uses text and an icon.
- **PRIMARY ACTIONS:** Record recheck/corrected loaded quantity within authorized plan; return to checklist.
- **SECONDARY ACTIONS:** Add factual follow-up; view revised plan. Loader cannot change planning allocations or dismiss Dispatcher-controlled critical resolution.
- **VALIDATION:** Recheck must correspond to current order/version; quantities remain bounded; critical issue resolution requires recorded remedy, not merely a second checkbox.
- **ERROR STATES:** Instruction outdated; save rejected; issue changed while open → refresh comparison.
- **EMPTY STATES:** No instruction yet → `Reported. Waiting for Dispatcher review.` Never substitute `Resolved` for absence of a reply.
- **LOADING STATES:** Timeline skeleton; preserve report details while fetching updates.
- **RESPONSIVE BEHAVIOR:** Single chronological column phone; tablet summary and timeline side by side; long notes wrap.
- **DATA SOURCE:** Issue, LoadingEvent, corrective action/audit and current PlanVersion.
- **WHAT OTHER ROLE IS AFFECTED:** Dispatcher receives recheck evidence; Driver readiness may unblock only after all applicable checks pass.
- **RATIONALE PARAGRAPH:** Warehouse feedback needs a closed loop. This detail view lets the Loader see whether the report was received and what action is authorized, without granting planning control. A visible correction history supports fast handoff while preventing a shortage from disappearing behind a changed status label.

## L05 — Plan Change Review

- **SCREEN ID:** L05
- **SCREEN NAME:** Plan Change Review
- **ROLE:** Loader.
- **PURPOSE:** Reconcile work already performed with a newly published plan.
- **PRIMARY USER DECISION:** Which loading lines/positions need rechecking before acknowledging the new version?
- **INFORMATION SHOWN:** `Plan updated: version <old> → <new>`; publisher/time; added/removed orders, changed quantities/sequence/vehicle/departure; previously loaded affected lines; unaffected progress retained; explicit recheck requirements.
- **COMPONENTS:** Change summary; before/after sequence list; affected-line checklist; `Acknowledge current plan` footer. Do not use raw JSON diff.
- **PRIMARY ACTIONS:** Review affected lines, record rechecks and acknowledge latest version.
- **SECONDARY ACTIONS:** Return to current checklist; report an issue if physically loaded goods cannot match revision.
- **VALIDATION:** Cannot acknowledge superseded version; current plan needs successful refresh; affected loaded lines cannot be silently carried forward; completed delivery evidence never reset.
- **ERROR STATES:** Another revision arrives → `A newer update is available`; comparison fetch fails → retain old work with `Not current` warning and no readiness.
- **EMPTY STATES:** No substantive loading changes → explain unchanged lines and allow acknowledgement; no changes at all routes back to L02.
- **LOADING STATES:** Compare-version skeleton; do not render ambiguous empty diff as no changes.
- **RESPONSIVE BEHAVIOR:** Desktop/tablet paired columns; phone per-change old/new blocks, not horizontal diff; summary remains above action.
- **DATA SOURCE:** Two published PlanVersions, loading entries/acknowledgements and affected-order mapping.
- **WHAT OTHER ROLE IS AFFECTED:** Dispatcher sees acknowledgement; Driver readiness recalculated; Store sees published scheduling changes independently.
- **RATIONALE PARAGRAPH:** A plan-change banner alone does not tell a Loader what must be fixed. The comparison focuses on practical changes to goods, sequence and departure and preserves unaffected work. Requiring explicit rechecks for affected lines prevents an outdated checklist from authorizing departure.

## L06 — Departure Readiness Review

- **SCREEN ID:** L06
- **SCREEN NAME:** Departure Readiness Review
- **ROLE:** Loader.
- **PURPOSE:** Confirm the current load is ready for driver handoff.
- **PRIMARY USER DECISION:** Are current-version loading checks complete and blocking issues resolved?
- **INFORMATION SHOWN:** Vehicle/trip/version, loaded versus expected lines/units, acknowledged plan, open issues and resolution evidence, named loader, review time and planned departure. This is loading readiness, not a new guarantee of route feasibility.
- **COMPONENTS:** Readiness checklist; blocking issue list; summary; `Confirm ready` button; success panel `Loading confirmed. Driver can review departure.`
- **PRIMARY ACTIONS:** Confirm ready after checks pass.
- **SECONDARY ACTIONS:** Return to affected checklist line/issue/change review.
- **VALIDATION:** Latest plan acknowledgement, complete required load records and no unresolved blocking exceptions. Actual departure remains Driver action; fresh server check required for online handoff.
- **ERROR STATES:** New revision/issue invalidates review; timeout verifies current readiness before retry; offline cannot falsely confirm server readiness.
- **EMPTY STATES:** No assigned goods → not ready; explain missing plan rather than allow empty successful load.
- **LOADING STATES:** `Checking current load…`; `Confirming readiness…`; no duplicate action.
- **RESPONSIVE BEHAVIOR:** Phone one-column review and sticky confirm; tablet compact panel; blocker count remains visible next to action.
- **DATA SOURCE:** Loading projection, Issue, PlanAcknowledgement and readiness mutation outcome.
- **WHAT OTHER ROLE IS AFFECTED:** Driver receives readiness; Dispatcher sees loading complete; Store may see Loading status but not an invented departure.
- **RATIONALE PARAGRAPH:** Readiness is a handoff between roles and deserves a clear, current review. The screen separates loaded goods from actual departure and makes unresolved issues visible. Its blocking behavior is a chosen safeguard, not a claim that the booklet mandates this exact approval mechanism.
