# Product, personas and navigation

## Product promise and boundaries

`<SOLUTION_NAME>` connects the decision to send an order with the work of loading, delivering and acknowledging it. The central question is operational: **What can move, what must wait, and who needs to act next?** The Dispatcher experience prioritizes allocation and exceptions; field experiences prioritize the next safe action and preservation of work.

Official context: 120 outlets, two depots, 60 vehicles, four roles, next-day 16:00 cutoff, finite capacity and unreliable field connectivity (booklet pp.3–7). Future-capacity planning is represented, but trained Datathon model integration is not required (p.15). No optimizer, GPS tracking, map, native application, photo/signature POD or staffing availability engine is included in the baseline.

## Four complete personas

These are **design personas synthesized from the booklet**, not interviews, real people or measured research. Names are illustrative. Age, gender, salary and fabricated quotes are deliberately omitted because they do not inform the workflow.

### P-D — Arnikan, Dispatcher

- **Context:** Peliyagoda planning office; large desktop screen; stable connection; coordinates both depot plans. Works with confirmed orders after cutoff and intervenes after departures.
- **Responsibilities:** allocate shared vehicles, sequence trips, respect capacity/access/temperature/windows/fuel, identify deferrals and track problems.
- **Goals:** publish a feasible plan, explain every unserved order and discover exceptions early enough to act.
- **Triggers:** intake closes; a vehicle becomes unavailable; loader reports a shortage; driver synchronizes an issue.
- **Decisions:** which eligible vehicle/trip can serve an order; which order must move to another run; whether a changed trip is ready.
- **Information needs:** weight and volume together, refrigeration/van eligibility, depot, window, fuel remaining, prior deferrals and current plan version.
- **Current friction:** fragmented spreadsheets, dispatcher-dependent knowledge, stale run sheets, separate phone updates and repeated skipped outlets.
- **Failure pressures:** publishing an infeasible plan, overlooking a repeat deferral, mistaking queued field data for current server truth.
- **Device/access needs:** keyboard-efficient dense layout, pinned identifiers, readable figures, explicit text with status colors, clear selected service date.
- **Cross-role dependencies:** receives store orders, distributes plan changes to Loader/Driver, acts on their exceptions, supplies stores with schedule/deferral information.
- **Success evidence:** all eligible orders have an explainable disposition; no unresolved hard validation errors at publication; field exceptions reach the attention queue.
- **Design consequence:** D03 keeps orders, trips and constraint explanation together; D01 leads with decisions and recency, not decorative analytics.

### P-L — Sanjeevan, Loader

- **Context:** Peliyagoda or Kandy dock, shared tablet/terminal; phone-sized use must also work. Frequent interruption and handoff are expected design considerations, not claimed user-research findings.
- **Responsibilities:** identify assigned load, follow stop sequence, record loading progress, flag missing/damaged/short goods before departure.
- **Goals:** load the correct current plan, avoid rehandling, make shortages visible before the vehicle leaves.
- **Triggers:** new load assigned, goods fail inspection, stop sequence changes after opening the plan.
- **Decisions:** what is loaded, what quantity is missing/damaged and whether the current checklist can be acknowledged.
- **Information needs:** vehicle/trip, departure, stop order, order reference, units, temperature handling, dock restrictions, plan changes and open issues.
- **Current friction:** printed lists become outdated and verbal reports are hard to trace.
- **Failure pressures:** acknowledging an old plan; marking an unavailable item loaded; handing over a shared session to the wrong person.
- **Device/access needs:** large targets, short forms, persistent trip identity, visible active user, touch-friendly steppers, no hover-only action.
- **Cross-role dependencies:** follows Dispatcher plan; reports exceptions back; readiness informs Driver.
- **Success evidence:** current-version checklist is explicit; every shortage has a recorded disposition; Driver sees whether departure review is complete.
- **Design consequence:** L02 is an operational checklist, not a dashboard; L05 shows a concise change comparison before acknowledgement.

### P-V — Thiru, Driver

- **Context:** personal phone on the road; unreliable coverage in hill country, Kandy corridor and rural districts. Interactions are designed for use while safely stopped.
- **Responsibilities:** follow assigned route, understand access/windows, record each stop and proof of delivery, retain work offline and synchronize later.
- **Goals:** know the next stop, complete a short accurate delivery record and trust that it will not disappear.
- **Triggers:** trip departure, arrival at outlet, connection loss, changed assignment, failed synchronization.
- **Decisions:** which stop to serve, what was delivered, what issue occurred and whether a record is local or reconciled.
- **Information needs:** next outlet, sequence, requested window, access/dock notes, order identity, delivery units, local-save result and pending-sync count.
- **Current friction:** paper instructions, separate calls, uncertain connectivity and disputes without durable evidence.
- **Failure pressures:** duplicate submission after a lost response, lost records after reload, stale plan changes overwriting actual completed work.
- **Device/access needs:** one-column screen, 48px minimum primary controls, readable outdoor contrast, low typing, visible offline state, no interaction demanded while driving.
- **Cross-role dependencies:** receives Dispatcher route and Loader readiness; provides delivery/POD to Dispatcher and Store Manager.
- **Success evidence:** recorded work survives offline reload; duplicates do not create duplicate deliveries; conflicts preserve evidence and have a resolution route.
- **Design consequence:** V03 shows one primary next action; V08/V09 distinguish connectivity, local persistence and server reconciliation.

### P-M — Ananthu, Store Manager

- **Context:** outlet counter, phone or desktop; orders follow brand schedule. Fresh may place separate dry and chilled orders for the same date.
- **Responsibilities:** place orders, understand confirmation/scheduling, prepare receipt staff, confirm what arrived and report discrepancies.
- **Goals:** know that an order was received, avoid confusing confirmation with scheduling and receive an honest arrival expectation.
- **Triggers:** new order requirement, confirmation, scheduled arrival, deferral notice or driver delivery record.
- **Decisions:** what to request and for which date; whether goods received match the delivery record; which issue to report.
- **Information needs:** outlet, requested date, units, temperature, cutoff, order reference, schedule/ETA source, reason for deferral and receipt quantities.
- **Current friction:** orders disappear into messages, no clear confirmation, no notice of changed expectations.
- **Failure pressures:** believing an unscheduled order has an ETA, losing an order form on network failure, duplicate order submission.
- **Device/access needs:** simple forms, strong labels, few primary actions, phone-friendly cards and accessible error summaries.
- **Cross-role dependencies:** sends confirmed demand to Dispatcher; receives Driver evidence; receipt/discrepancies update Dispatcher.
- **Success evidence:** every submitted order has an unambiguous confirmation or retry state; deferrals are understandable; receipt does not silently overwrite the driver's account.
- **Design consequence:** M05 uses a plain-language timeline and separates driver-reported delivery from store-confirmed receipt.

## Final navigation and application shells

### Dispatcher shell

- Desktop sidebar: Overview (D01), Orders (D02), Planning (D03), Fleet (D05), Deliveries (D08), Deferrals (D07), Exceptions (D09), Future Capacity (D10).
- Context destinations: Trip Detail (D04), Outlet Detail (D06), Publish Review (D11).
- Header: tenant/product, selected service date, depot filter, connection/freshness, user identity. No fake global search: search is scoped to the current list.
- Selected service date and depot persist when moving among operational screens. D10 has a separate forecast period, visibly labelled.
- Exception count is server-confirmed and date/scope-aware; pending local driver events do not inflate a live count before receipt.

### Loader shell

- Tablet: compact top navigation `Loads` (L01), `Active load` (L02), `Issues` (L04 filtered).
- Phone: bottom navigation `Loads`, `Active load`; issue action belongs to the current checklist, avoiding an empty global tab.
- Always show user, depot, trip/vehicle and published plan version inside active work. Sign-out is accessible; switching identities requires authentication, not a role dropdown.
- Context destinations: Exception report (L03), Revision review (L05), Readiness review (L06).

### Driver shell

- Bottom navigation: `Today` (V01), `Trip` (V02), `Sync` (V09, badge = pending unique events).
- Persistent top connection strip and local-save feedback. Active screen body shows trip/stop identity; bottom action area respects device safe area.
- Context destinations: Stop (V03), Arrival (V04), Outcome (V05), POD (V06), Issue (V07), Offline state (V08), Completion (V10).
- No disruptive modal appears solely because connection drops while navigating. Changes requiring a driver decision wait for safe interaction.

### Store shell

- Desktop: Dashboard (M01), Orders (M04), primary `Create order` (M02).
- Phone: Home, Orders; create action stays prominent without duplicating floating and footer buttons.
- Context destinations: Confirmation (M03), Order Detail (M05), Receipt (M06), Issue (M07).
- Outlet identity is always visible. If a user has several authorized outlets, an explicit selector changes scope; no invented unrestricted cross-store access.

## Canonical inventory

| ID | Name | Parent navigation |
|---|---|---|
| S01 | Sign in | Entry |
| S02 | Session recovery | Shared recovery |
| S03 | Access denied | Shared recovery |
| S04 | Unavailable / not found | Shared recovery |
| D01 | Operations Overview | Overview |
| D02 | Confirmed Orders and Intake | Orders |
| D03 | Planning Workspace | Planning |
| D04 | Trip Detail and Stop Sequence | Planning / Deliveries |
| D05 | Fleet Availability and Vehicle Detail | Fleet |
| D06 | Outlet Detail | Orders / Planning |
| D07 | Deferrals and Service History | Deferrals |
| D08 | Delivery Progress and Detail | Deliveries |
| D09 | Exception Resolution | Exceptions |
| D10 | Future Capacity | Future Capacity |
| D11 | Plan Publication Review | Planning |
| L01 | Assigned Loads | Loads |
| L02 | Load Checklist | Active load |
| L03 | Report Loading Exception | Active load |
| L04 | Loading Issue Detail | Issues / Active load |
| L05 | Plan Change Review | Active load |
| L06 | Departure Readiness Review | Active load |
| V01 | Today’s Trips | Today |
| V02 | Active Trip | Trip |
| V03 | Stop Detail | Trip |
| V04 | Record Arrival | Trip |
| V05 | Delivery Outcome | Trip |
| V06 | Proof of Delivery | Trip |
| V07 | Report Delivery Issue | Trip |
| V08 | Offline Active Delivery | Trip state |
| V09 | Sync Center and Recovery | Sync |
| V10 | Trip Completion | Trip |
| M01 | Store Overview | Home |
| M02 | Create Order | Create |
| M03 | Order Confirmation | Create |
| M04 | Order History | Orders |
| M05 | Order and Delivery Detail | Orders |
| M06 | Confirm Receipt | Orders |
| M07 | Report Store Issue | Orders |

## Information boundaries

The Dispatcher sees the operational plan and authorized depots. Loaders see assigned work and relevant goods/sequence information. Drivers cache only assigned work. Store Managers see their authorized outlets and orders, not other outlets' allocations, other users' contact data or unrestricted fleet details. No public role-switch control is included; the judge uses the four seeded accounts.
