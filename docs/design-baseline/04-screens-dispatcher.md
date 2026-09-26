# Dispatcher screen specifications

Apply global state/accessibility contracts in document 02. The primary frame is 1440px wide; mobile adaptations are specified individually. All sample identifiers are illustrative placeholders. No live values are fabricated.

## D01 — Operations Overview

- **SCREEN ID:** D01
- **SCREEN NAME:** Operations Overview
- **ROLE:** Dispatcher.
- **PURPOSE:** Identify the next operational intervention for a selected service date/depot.
- **PRIMARY USER DECISION:** Open planning, investigate an exception or follow up on an at-risk trip.
- **INFORMATION SHOWN:** Date/depot and `Updated <time>`; cutoff/run state; counts of confirmed, planned, deferred, in-transit and delivered orders; active exceptions; available reefers/vans; trip progress; upcoming window risks; repeatedly deferred outlets. Count definitions appear in tooltips. Only show a value if its source is available.
- **COMPONENTS:** Header; compact linked metric strip; wide trip-progress table; right exception rail; lower deferral-attention list. No decorative trend chart/map. Rows show trip, vehicle, stops complete/total, planned next arrival, last event and status.
- **PRIMARY ACTIONS:** `Open planning`; select highest-priority exception.
- **SECONDARY ACTIONS:** Filter date/depot; open trip, outlet or filtered order list; refresh.
- **VALIDATION:** Date must exist in calendar; closed/nonoperating dates explicitly labelled; all metrics share the visible scope.
- **ERROR STATES:** Individual panel failure stays local with retry; whole read failure shows retained snapshot and stale timestamp. `Progress may be out of date` when refresh fails.
- **EMPTY STATES:** `No plan published for this date` → open planning; no exceptions → `No open exceptions in this scope`; no orders is not a zero-success claim.
- **LOADING STATES:** Metric/table skeleton; on refresh retain prior counts with updating label.
- **RESPONSIVE BEHAVIOR:** Desktop table + rail; tablet stacked panels; phone priority list, compact counts and trip cards. No horizontally shrunken dashboard.
- **DATA SOURCE:** Order/run decisions, current plans/trips, server delivery events, vehicle availability, issue and deferral projections.
- **WHAT OTHER ROLE IS AFFECTED:** Navigation only; subsequent decisions affect Loader, Driver or Store. Unsynced driver records are not shown as server-confirmed.
- **RATIONALE PARAGRAPH:** The home view earns its space by routing the Dispatcher toward an actionable condition. Compact counts establish scale, while exception and trip details explain what to do next. Shared date/depot scope and recency prevent a polished dashboard from giving misleading operational reassurance.

## D02 — Confirmed Orders and Intake

- **SCREEN ID:** D02
- **SCREEN NAME:** Confirmed Orders and Intake
- **ROLE:** Dispatcher.
- **PURPOSE:** Review the demand eligible for a planning run.
- **PRIMARY USER DECISION:** Which confirmed orders to plan, and which belong to a later run.
- **INFORMATION SHOWN:** Requested service date, intake cutoff 16:00 Sri Lanka time, open/closed status; order ref, outlet, brand, district, depot, temperature, units, weight, volume, requested window, van/mall restriction, prior deferral, confirmation and eligible run. Separate dry/chilled orders remain separate rows.
- **COMPONENTS:** Run header; status tabs `This run`/`Following run`; filter row brand/district/temp/depot; searchable, sortable table; selection summary; order detail drawer with request and confirmation timestamps.
- **PRIMARY ACTIONS:** `Plan selected orders` → D03; open order details.
- **SECONDARY ACTIONS:** Search exact reference/outlet; clear filters; inspect cutoff explanation/history. Manual early cutoff is excluded; a review acknowledgement may be used without changing official cutoff.
- **VALIDATION:** Only eligible confirmed records enter the run; stale selection rechecked; do not merge orders by outlet/date; server clock authority is a proposed DD.
- **ERROR STATES:** `Orders changed since you opened this queue. Review the updated list.` Read failure retains filters; no rows removed silently.
- **EMPTY STATES:** `No confirmed orders for this run`; `No orders match these filters` with clear action; upcoming cutoff explains when more may arrive.
- **LOADING STATES:** Table skeleton; filter refresh retains selection only for still-eligible IDs.
- **RESPONSIVE BEHAVIOR:** Desktop dense table; phone order cards with temp/access and both quantities prominent; selection uses explicit checkboxes, not hover.
- **DATA SOURCE:** Order, IntakeRun, Outlet, CalendarDay, deferral history.
- **WHAT OTHER ROLE IS AFFECTED:** Store sees accepted/eligible information; scheduling changes only after plan publication.
- **RATIONALE PARAGRAPH:** The intake view separates receipt of demand from the decision to serve it. Exposing cutoff, eligibility and distinct order references prevents two common mistakes: treating confirmation as a delivery promise and collapsing a Fresh outlet's dry and chilled demand into one record. Filters improve planning without hiding the following-run queue.

## D03 — Planning Workspace

- **SCREEN ID:** D03
- **SCREEN NAME:** Planning Workspace
- **ROLE:** Dispatcher.
- **PURPOSE:** Build a complete feasible allocation and explicit deferral decisions.
- **PRIMARY USER DECISION:** Assign an order to an eligible trip or defer it with a reason.
- **INFORMATION SHOWN:** Plan date/depot/version; unassigned/served/deferred counts; order facts from D02; eligible vehicles; trip number 1/2; assigned orders/stops; weight and volume used/max/remaining; refrigeration/access/depot/window checks; weekly fuel estimate/reservation; prior skips; change/save state.
- **COMPONENTS:** Three-pane workspace: order queue, trip cards, selection/constraint inspector. Sticky coverage footer; independent capacity bars; violation list with actual vs limit. Draft-only `Unassigned` clearly distinct from published disposition.
- **PRIMARY ACTIONS:** `Create trip`, `Assign`, `Defer`, `Review publication` → D11.
- **SECONDARY ACTIONS:** Remove assignment; move order; open D04; change eligible vehicle; undo an unsaved edit; inspect deferral history. Drag/drop is optional and never the only control.
- **VALIDATION:** All operational constraints; max two routes; weekly fuel; available vehicle; no incomplete order coverage on publish. Unknown timing/distance yields `Needs data`, not valid. Edits invalidate previous checks.
- **ERROR STATES:** Specific messages: `Chilled goods require a reefer`; `This outlet requires a van`; `Volume exceeds capacity by <x> m³`; `Fuel allowance exceeded by <x> L`; version conflict preserves draft for review.
- **EMPTY STATES:** No trips → `Create the first trip`; no eligible vehicle → explain failed criteria and offer deferral; no demand → return to intake.
- **LOADING STATES:** Initial pane skeletons; eligible-vehicle calculation shows `Checking eligibility…`; save state explicit; no optimistic published success.
- **RESPONSIVE BEHAVIOR:** Three panes ≥1440; two panes with constraint drawer at 1024; tabs Orders/Trips/Checks below; phone sequential assign form and full-width inspector.
- **DATA SOURCE:** Plan draft, orders, vehicle/calendar/outlet references, fuel ledger, validation projection and Deferral.
- **WHAT OTHER ROLE IS AFFECTED:** Draft edits stay private to planning; publication updates Loader/Driver instructions and Store schedule/deferral notices.
- **RATIONALE PARAGRAPH:** Allocation requires comparing demand, vehicle capability and consequences simultaneously. The workspace keeps these facts close and gives every order a visible destination, including deferral. Explainable checks support manual/assisted planning without pretending to provide an optimizer or hiding invalid decisions behind visual drag-and-drop.

## D04 — Trip Detail and Stop Sequence

- **SCREEN ID:** D04
- **SCREEN NAME:** Trip Detail and Stop Sequence
- **ROLE:** Dispatcher.
- **PURPOSE:** Inspect or edit a trip's ordered execution plan.
- **PRIMARY USER DECISION:** Is the vehicle, stop sequence and timing feasible and ready to distribute?
- **INFORMATION SHOWN:** Trip ref/number, plan version, vehicle/depot, assigned driver, departure, ordered stops; each stop order/outlet, dock/access, window, planned arrival, handling allowance and travel estimate provenance; totals for both capacities, distance/fuel and issues. Planned/actual times visibly separate.
- **COMPONENTS:** Trip header; route timeline/list rather than decorative map; capacity summary; stop detail drawer; move-up/down controls; revision marker.
- **PRIMARY ACTIONS:** Save sequence; `Validate trip`; return to D11 if draft ready.
- **SECONDARY ACTIONS:** Change vehicle/departure in editable draft; open outlet; inspect change history. Published/in-progress edits begin a revision rather than overwrite history.
- **VALIDATION:** Recompute downstream arrival/waiting and fuel after changes; no departure/overlap fiction; completed stops protected; current vehicle trip count checked.
- **ERROR STATES:** `Stop <n> misses its delivery window`; missing travel data; stale plan; editing already completed work blocked with explanation.
- **EMPTY STATES:** No stops → `Add orders in planning`; no assignment → select vehicle before final validation.
- **LOADING STATES:** Stable ordered skeleton; recalculating times marks only affected fields pending.
- **RESPONSIVE BEHAVIOR:** Desktop list + inspector; phone vertical stop cards with reorder buttons and sticky save; preserve meaningful sequence numbers.
- **DATA SOURCE:** Trip, TripStop, Allocation, reference windows/dock data, estimation inputs and delivery progress.
- **WHAT OTHER ROLE IS AFFECTED:** Published sequence drives Loader packing order, Driver route and Store expected arrival.
- **RATIONALE PARAGRAPH:** A trip is a sequence of commitments rather than a vehicle with a bag of orders. Showing arrival assumptions and outlet conditions beside each stop helps the Dispatcher see why sequence changes matter. Revision boundaries protect field users from silently changing instructions and preserve completed delivery evidence.

## D05 — Fleet Availability and Vehicle Detail

- **SCREEN ID:** D05
- **SCREEN NAME:** Fleet Availability and Vehicle Detail
- **ROLE:** Dispatcher.
- **PURPOSE:** Understand usable fleet capacity and vehicle-specific constraints.
- **PRIMARY USER DECISION:** Which available vehicle can support the current plan, or which assignment needs review after unavailability.
- **INFORMATION SHOWN:** Vehicle source ID, depot, truck/van, reefer/ambient, availability, driver association, weight/volume limits, assigned trips 0/2, fuel type, km/L, weekly quota, used/reserved/remaining litres and estimate provenance. Detail shows affected trips and operational history.
- **COMPONENTS:** Filtered vehicle table; detail drawer; two capacity bars; fuel summary; availability-change dialog with reason.
- **PRIMARY ACTIONS:** Select vehicle for planning; record unavailability with reason (DD operational control).
- **SECONDARY ACTIONS:** Filter depot/type/temp/status; inspect current trips; return vehicle to available after confirmation of status.
- **VALIDATION:** No independent driver-availability constraint; unavailable vehicle cannot receive new allocation; status change identifies affected plans rather than silently unassigning them; fuel values use the approved week definition.
- **ERROR STATES:** Stale availability/fuel; failure to save status; missing efficiency blocks trustworthy fuel estimation.
- **EMPTY STATES:** No suitable reefers/vans → visible constraint explanation and planning link; no matching filter → clear filters.
- **LOADING STATES:** Table/detail skeleton; preserve prior availability with freshness warning on failed refresh.
- **RESPONSIVE BEHAVIOR:** Desktop table and drawer; phone capability cards and full-screen detail; never hide volume behind a hover tooltip.
- **DATA SOURCE:** Vehicle, VehicleAvailability, driver association, Trip, fuel usage/reservations.
- **WHAT OTHER ROLE IS AFFECTED:** Dispatcher must revise impacted work; Loader/Driver receive changes after publication; affected stores receive schedule/deferral updates.
- **RATIONALE PARAGRAPH:** Vehicle selection depends on several independent dimensions. Separating availability from assignment and showing both physical capacities and fuel prevents an attractive fleet view from hiding the actual limiting resource. Explicit impact review avoids turning an availability edit into an unannounced field-plan change.

## D06 — Outlet Detail

- **SCREEN ID:** D06
- **SCREEN NAME:** Outlet Detail
- **ROLE:** Dispatcher.
- **PURPOSE:** Review delivery constraints and service history before an allocation/deferral decision.
- **PRIMARY USER DECISION:** How can this outlet be served, and has it already been repeatedly skipped?
- **INFORMATION SHOWN:** Source outlet ID/name if supplied, brand, district, depot, available address, dock type, parking restriction, requested window, mall window; current orders; recent service dates; deferral reasons/count; days since last served only when known.
- **COMPONENTS:** Identity header; compact access/window facts; order list; service/deferral timeline. Official reference constraints are read-only in baseline.
- **PRIMARY ACTIONS:** Open order in planning or deferral review.
- **SECONDARY ACTIONS:** View delivery evidence/history; return to previous filtered context.
- **VALIDATION:** Distinguish requested window from mall access window; unknown address/history not invented; duplicate daily orders remain distinct.
- **ERROR STATES:** Source record unavailable; incomplete window data; history panel failure independent of identity panel.
- **EMPTY STATES:** `No recorded service history`; `No orders in this run`; neither implies never served in reality.
- **LOADING STATES:** Fact and history skeletons; no fabricated last-served date.
- **RESPONSIVE BEHAVIOR:** Desktop detail page/drawer; phone stacked facts and timeline, long outlet names wrap.
- **DATA SOURCE:** Outlet, current Order, Delivery records and Deferral history.
- **WHAT OTHER ROLE IS AFFECTED:** Read-only; resulting planning decisions affect field users and Store.
- **RATIONALE PARAGRAPH:** Restriction and service history must be considered together when deciding whether an outlet can wait again. This view makes constraints legible without allowing casual edits to supplied data. Honest gaps in history avoid converting missing records into an unsupported fairness claim.

## D07 — Deferrals and Service History

- **SCREEN ID:** D07
- **SCREEN NAME:** Deferrals and Service History
- **ROLE:** Dispatcher.
- **PURPOSE:** Explain, review and reconsider every deferred order.
- **PRIMARY USER DECISION:** Defer with an explicit reason, change an uncommitted decision, or reconsider in the next run.
- **INFORMATION SHOWN:** Order/outlet, run/date, required capability/capacity, reason, decision actor/time, previous skips, known last service, consequence note and next consideration state. Show earlier decisions without replacing them after later service.
- **COMPONENTS:** Deferral list; selected-order context; reason form; history timeline; filters for repeated skips and reason. Proposed reasons: capacity, reefer unavailable, van unavailable, window infeasible, fuel allowance, vehicle unavailable, other with explanation.
- **PRIMARY ACTIONS:** `Record deferral`; `Reconsider in planning`.
- **SECONDARY ACTIONS:** Open constraint evidence/outlet; edit draft reason; inspect served-later history.
- **VALIDATION:** Required reason; other requires explanation; no guaranteed date unless actually scheduled; a published decision change requires plan revision; next-run inclusion does not auto-allocate.
- **ERROR STATES:** Order already allocated in a newer version; save failure retains explanation; missing last-service data remains unknown.
- **EMPTY STATES:** `No deferred orders for this run`; filtered repeated-skip list may be empty without hiding other deferrals.
- **LOADING STATES:** List/timeline skeleton; submitting reason disables only that mutation.
- **RESPONSIVE BEHAVIOR:** Desktop list + detail; phone cards followed by full-page reason form with prior-skip context above action.
- **DATA SOURCE:** Deferral, PlanDecision, Order, Delivery service history, validation result.
- **WHAT OTHER ROLE IS AFFECTED:** Store receives clear notice after publication; Loader/Driver must not receive deferred orders as assigned work.
- **RATIONALE PARAGRAPH:** Deferral is an operational decision with consequences, not a discarded row. Keeping the reason, previous skips and next consideration visible makes the decision explainable and reviewable. The design supports fairness without inventing a mandatory ranking formula or promising delivery the fleet cannot yet support.

## D08 — Delivery Progress and Detail

- **SCREEN ID:** D08
- **SCREEN NAME:** Delivery Progress and Detail
- **ROLE:** Dispatcher.
- **PURPOSE:** Understand execution and receipt after departure.
- **PRIMARY USER DECISION:** Follow up on a delayed/missing update or resolve a delivery discrepancy.
- **INFORMATION SHOWN:** Trips and completed/total stops, next stop, planned arrival and actual arrival where recorded, last server update, driver outcome/POD metadata, store receipt status, open issues; no claim of live vehicle position. Locally unsynced activity is unknown to the server unless a prior heartbeat indicates disconnection.
- **COMPONENTS:** Progress table/cards; detail timeline; evidence panel; receipt panel; issue links; freshness banner.
- **PRIMARY ACTIONS:** Open issue resolution; inspect delivery evidence.
- **SECONDARY ACTIONS:** Filter trip/depot/status; open trip; refresh; view acknowledged sync-conflict evidence.
- **VALIDATION:** Delivered record and store-confirmed receipt remain separate; times distinguish occurrence and receipt; no inferred successful delivery from elapsed ETA.
- **ERROR STATES:** Refresh failure with retained snapshot; inaccessible POD metadata; conflict pending review surfaced explicitly.
- **EMPTY STATES:** `No trips have departed`; `No delivery record received yet`; `Awaiting store confirmation` are distinct.
- **LOADING STATES:** Progress skeleton; detail evidence section loads independently.
- **RESPONSIVE BEHAVIOR:** Desktop table/detail; phone trip cards and chronological events, evidence full width.
- **DATA SOURCE:** Server Trip/Delivery events, POD, ReceiptConfirmation, Issue and sync review outcomes.
- **WHAT OTHER ROLE IS AFFECTED:** Resolution/revision may affect Driver and Store; read-only monitoring does not send automatic promises.
- **RATIONALE PARAGRAPH:** Dispatch needs reliable evidence more than a decorative live map. The timeline distinguishes planned, driver-reported and store-confirmed facts and exposes update recency. That prevents offline silence from being mistaken for either failure or success and makes receipt discrepancies easier to investigate.

## D09 — Exception Resolution

- **SCREEN ID:** D09
- **SCREEN NAME:** Exception Resolution
- **ROLE:** Dispatcher.
- **PURPOSE:** Act on loading, delivery, vehicle, constraint and sync-conflict exceptions.
- **PRIMARY USER DECISION:** What corrective action resolves the issue without losing the original report?
- **INFORMATION SHOWN:** Issue ID/type/severity, linked order/trip/outlet, reporter and occurrence/received times, report details, affected quantities, plan versions, current action owner, event history, proposed remedy. Sync conflicts show original local record beside current server assignment.
- **COMPONENTS:** Severity-filtered queue; detail panel; action/history timeline; resolution form; version comparison for sync conflicts.
- **PRIMARY ACTIONS:** Acknowledge; record corrective action; resolve with explanation. For conflicts, accept evidence onto the correct record or retain as unresolved/rejected with explicit reason; never overwrite history.
- **SECONDARY ACTIONS:** Open affected planning/load/delivery detail; request operational follow-up through a recorded action (no assumed external messaging integration).
- **VALIDATION:** Resolution needs a reason and required linked corrective action; critical loading issue cannot be cleared merely by changing a badge; incompatible evidence cannot be auto-accepted.
- **ERROR STATES:** Issue changed by another session; resolution failed; correction requires a plan revision; original evidence remains readable.
- **EMPTY STATES:** `No open exceptions`; closed history stays accessible; no filter matches has clear-reset action.
- **LOADING STATES:** Queue skeleton; resolution shows pending server confirmation.
- **RESPONSIVE BEHAVIOR:** Desktop queue/detail comparison; phone original/current tabs with clear identity labels and safe-area action footer.
- **DATA SOURCE:** Issue, LoadingEvent, DeliveryEvent, SyncEvent review, PlanVersion and audit records.
- **WHAT OTHER ROLE IS AFFECTED:** Loader sees corrective outcome; Driver sees accepted/conflict result; Store receives corrected delivery/receipt information where relevant.
- **RATIONALE PARAGRAPH:** Exception handling should finish a business problem rather than simply dismiss an alert. A preserved report, explicit remedy and visible affected records give the Dispatcher enough context to resolve shortages and offline conflicts responsibly. The same pattern supports auditability without introducing an oversized ticketing system.

## D10 — Future Capacity

- **SCREEN ID:** D10
- **SCREEN NAME:** Future Capacity
- **ROLE:** Dispatcher.
- **PURPOSE:** Compare future ordered-volume expectations with stated capacity assumptions.
- **PRIMARY USER DECISION:** Which future depot/week needs attention for vehicle, driver or refrigerated capacity planning?
- **INFORMATION SHOWN:** Depot, brand, ISO year/week, forecast total/chilled volume, source/run date, horizon, known uncertainty only if supplied; optional capacity scenario inputs and caveats. Do not imply volume alone guarantees a feasible fleet count.
- **COMPONENTS:** Scope controls; tabular forecast; optional simple total/chilled stacked columns when they answer a weekly comparison; provenance panel; explicitly labelled capacity scenario notes.
- **PRIMARY ACTIONS:** Review week; record capacity-planning note or scenario (DD).
- **SECONDARY ACTIONS:** Change scope; inspect source/assumptions. Trained-model integration, automatic staffing conversion and export are optional.
- **VALIDATION:** Chilled portion cannot exceed total in authored scenario; Style/Tech chilled forecast zero for Task 2A-derived data; no fabricated confidence interval; unknown forecast cannot produce resource recommendations.
- **ERROR STATES:** Forecast unavailable/stale/schema mismatch; retain source error without falling back to fake analytics.
- **EMPTY STATES:** `No forecast available for this period`; explain source not connected. Prototype may use clearly labelled illustrative forecast, never pass it off as trained output.
- **LOADING STATES:** Table skeleton, provenance loaded with values; avoid isolated numbers without source.
- **RESPONSIVE BEHAVIOR:** Desktop comparison table; phone week cards and brand filter; chart optional and accessible data table always available.
- **DATA SOURCE:** Approved forecast import or explicitly authored prototype scenario; not a required Datathon service.
- **WHAT OTHER ROLE IS AFFECTED:** Future resourcing decisions, not immediate order promises or current-trip assignments.
- **RATIONALE PARAGRAPH:** Future demand matters to the business, but a forecast must not masquerade as a complete allocation. This screen separates predicted volumes from resource assumptions and shows where the data came from. It preserves the overall planning objective without making Datathon integration or an unsupported fleet-conversion formula a Hackathon dependency.

## D11 — Plan Publication Review

- **SCREEN ID:** D11
- **SCREEN NAME:** Plan Publication Review
- **ROLE:** Dispatcher.
- **PURPOSE:** Commit a complete, validated plan and communicate its consequences.
- **PRIMARY USER DECISION:** Is the latest plan ready to publish or must blocking problems be resolved?
- **INFORMATION SHOWN:** Date/depot/current draft version; eligible orders = served + deferred; unassigned count; trip/vehicle totals; both capacities; fuel/route/window checks; deferral reasons; changed trips and affected users; validation timestamp tied to current revision.
- **COMPONENTS:** Review page with coverage summary, blocking/advisory lists, deferral summary and final action area. Confirmation dialog: `Publish this plan? Loaders and drivers will receive this version. Stores will see scheduling or deferral updates.`
- **PRIMARY ACTIONS:** `Publish plan` only when authoritative checks pass; `Fix blocking issues` returns to focused item.
- **SECONDARY ACTIONS:** Back to draft; inspect trip/deferral details; cancel publication without losing draft.
- **VALIDATION:** Complete order coverage, all operational constraints, latest revision and resource reservation checked atomically; advisory acknowledgement never overrides a hard rule.
- **ERROR STATES:** `The plan changed during review`; `Vehicle availability changed`; publication failure leaves draft intact; ambiguous timeout queries publication state before retry.
- **EMPTY STATES:** No eligible orders → no fabricated operational plan; show empty-run summary and return to queue.
- **LOADING STATES:** `Validating latest plan…`, then `Publishing…`; retain review and prohibit duplicate publication.
- **RESPONSIVE BEHAVIOR:** Desktop wide review; phone accordion sections and sticky final action with blocker count; essential blockers never hidden only in collapsed content.
- **DATA SOURCE:** Plan/version, coverage decisions and full server validation/publication result.
- **WHAT OTHER ROLE IS AFFECTED:** Loader receives current load, Driver assigned trip/revisions, Store schedule or deferral notice; published history retained.
- **RATIONALE PARAGRAPH:** Publication is where a private draft becomes instructions and expectations for three other roles. A dedicated review makes missing decisions and downstream changes visible before that commitment. Binding validation to the current revision avoids the false confidence of a previously valid plan that has since changed.
