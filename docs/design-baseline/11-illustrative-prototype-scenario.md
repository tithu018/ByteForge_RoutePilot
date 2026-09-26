# Illustrative prototype scenario manifest

**Classification: independently authored ILLUSTRATIVE data.** These are not records from the official dataset, not model predictions and not claims about particular Waypoint outlets or vehicles. Use only with an `Illustrative scenario` annotation in the design presentation. Official record-based frames must replace these after authorized local data review; this manifest does not satisfy the shared-dataset requirement by itself.

Purpose: supply exact coherent values for the main prototype rather than leave each designer to invent conflicting numbers. The scenario is intentionally small and is not a 60-vehicle seed or a claim about optimal allocation.

## Scope and identities

- Service date label: `Illustrative Monday`; actual date to be selected from official calendar before final source-based frames.
- Depot: Peliyagoda. Tenant: Waypoint Group. Current published plan: `DEMO-PLAN-A`, version 1.
- Accounts shown by role label in presentation; the personas' illustrative names may appear as authors, but no actual login credentials are invented here.
- Four confirmed orders: all Fresh, with distinct outlet references; no assumption that actual official outlets share these attributes.
- Two available vehicles **in this scenario**; do not label the remainder of the real 60-vehicle fleet unavailable. Fleet-wide metric remains `Scenario fleet: 2 available`.
- Source-address value: `Address not supplied in illustrative scenario`; use district only if authored and clearly annotated, not a fabricated GPS location.

## Orders and capacity

| Order | Outlet | Temp | Units | Weight | Volume | Requested window | Access/dock | Decision |
|---|---|---|---:|---:|---:|---|---|---|
| DEMO-ORDER-A | DEMO-OUTLET-A | Ambient | 40 | 400 kg | 4.0 m³ | 06:00–07:30 | Normal / rear_dock | Served: DEMO-TRUCK-A, trip 1, stop 1 |
| DEMO-ORDER-B | DEMO-OUTLET-B | Chilled | 20 | 200 kg | 2.0 m³ | 06:30–07:45 | Normal / street | Served: DEMO-TRUCK-A, trip 1, stop 2 |
| DEMO-ORDER-C | DEMO-OUTLET-C | Ambient | 25 | 250 kg | 2.0 m³ | 06:30–07:45 | Van_only / street | Served: DEMO-VAN-A, trip 1, stop 1 |
| DEMO-ORDER-D | DEMO-OUTLET-D | Chilled | 100 | 1,600 kg | 8.0 m³ | 06:00–07:30 | Normal / rear_dock | Deferred for this run |

No mall order is hidden in these values. A separate constraint branch may use `DEMO-MALL-E` with an explicitly authored requested window `06:00–08:00` and mall window `06:30–07:15`; it is a **validation sandbox**, not a fifth order in the four-order overview totals. This prevents branch demonstrations from changing main-flow counts accidentally.

| Vehicle | Type/temp | Weight cap | Volume cap | Fuel assumptions for scenario | Current assignment |
|---|---|---:|---:|---|---|
| DEMO-TRUCK-A | Truck/reefer | 1,500 kg | 10.0 m³ | Quota 60 L; previous use 12 L; planned full-route distance 120 km at 8 km/L = 15 L reservation; 33 L remaining | 600/1,500 kg; 6.0/10.0 m³; 1 of 2 routes |
| DEMO-VAN-A | Van/ambient | 500 kg | 3.0 m³ | Quota 30 L; previous use 10 L; full-route distance 40 km at 10 km/L = 4 L reservation; 16 L remaining | 250/500 kg; 2.0/3.0 m³; 1 of 2 routes |

Distances, fuel-week accounting and schedule are illustrative operational assumptions, **not Task 2B calculations**. Fuel reservation and actual use must not both be subtracted for the same completed trip; after reconciliation, reservation is replaced/released against actual usage as appropriate.

Deferral copy for D: `No available refrigerated vehicle in this scenario can carry this whole order within its weight limit. The available reefer is limited to 1,500 kg; this order is 1,600 kg.` Whole-order allocation is our operational design decision. An additional trip does not fix an indivisible per-order capacity violation. Do not claim this demonstrates unavoidable deferral across the actual full fleet or all possible order-splitting policies.

History fixture: D was deferred in the previous run; last recorded successful delivery was two service days earlier. Display `Previously deferred: yes` and `Last recorded service: two service days earlier` until real dates are assigned; do not calculate calendar-day counts from this phrase. Next state: `Pending consideration in following run`, no promised delivery date.

## Ordered trip and loading story

Truck trip: planned depart 05:30; A planned arrival 06:10, handling 15 minutes; B planned arrival 06:50, handling 15 minutes. Arrival estimates precede the individual window closes and 08:00. Van C planned arrival 06:45. These are prototype planned times, not output of an implemented routing model.

Loader branch: A expected 40 units; initial available quantity 38 → L03 Short, affected quantity 2 → D09 replacement instruction → L04 recheck finds all 40 → issue resolved with evidence → L02 A 40/40, B 20/20 → L06 readiness. Before resolution, critical hold is a chosen design safeguard. The final order quantity remains 40; there is no silent customer-order reduction.

Revision branch uses version 2 in a **separate branch snapshot** with changed stop/departure instructions; it does not silently alter the version-1 main offline sequence. Prototype presentation must label branch entry and reset scenario on returning.

## Exact offline event counts and times

Main offline stop: B. A already delivered and synchronized. Driver downloaded version 1 at 05:10 and departed with accepted readiness at 05:30. Connection drops at 06:48 before B's arrival.

| Frame state | Event / time | Pending count | Visible result |
|---|---|---:|---|
| Online before loss | No pending events | 0 | Online; A delivered; B next |
| Offline before arrival | Connection lost 06:48 | 0 | Offline; saved trip version 1 |
| Arrival recorded | DEMO-EVENT-1, Arrived 06:52 | 1 | Arrival saved on this device |
| Handling started | DEMO-EVENT-2, Handling 06:53 | 2 | Handling recorded locally |
| Outcome draft | 20 units as expected | 2 | Draft saved; no final completion event |
| POD + outcome committed | DEMO-EVENT-3, Complete 07:05 | 3 | Delivery recorded locally; receiver `Demo receiver`; attested; no image/signature |
| Offline reload | Reopen at 07:06 | 3 | Same arrival/handling/outcome/POD and event IDs |
| Reconnect | Online 07:10 | 3 initially | Sync begins, not immediate false zero |
| Accepted reconciliation | Events 1→2→3 accepted | 0 | All recorded actions synced; original occurrence times retained |

Prototype record IDs are annotations, not driver-facing implementation jargon. Occurrence and server receipt times differ; Dispatcher timeline may show `Delivered 07:05 · received 07:10`.

**Duplicate branch:** server has accepted event 3 but response was lost. Events 1/2 already acknowledged; pending count is 1. Replaying identical event 3 yields `Already received`, count 0 and only one delivered order/POD record.

**Retry branch:** temporary transport failure leaves the remaining event(s) pending with the same IDs; no new local event is created by the Retry button.

**Conflict branch:** version/assignment changed in the separately labelled branch. Events not applicable to the current assignment remain preserved for D09 review; do not mark all three delivered simply because connectivity returned. A conflict can result in accepted reconciliation or retained evidence with explicit unresolved/rejected reason.

## Exact cross-role overview counts

| Snapshot | Eligible | Served planning decisions | Deferred decisions | Delivered accepted | Truck loading |
|---|---:|---:|---:|---:|---|
| Draft before allocation | 4 | 0 | 0 | 0 | Not started; 4 unassigned decisions |
| Published version 1 | 4 | 3 | 1 | 0 | Awaiting loading |
| Truck ready | 4 | 3 | 1 | 0 | 2/2 orders loaded, 60/60 units |
| A accepted; B offline complete; C not yet recorded | 4 | 3 | 1 | 1 | Truck in transit |
| B sync accepted; C still pending | 4 | 3 | 1 | 2 | Handed over |

Do not add Served planning decisions and Delivered as if they were disjoint categories. B appears delivered to Driver locally at 07:05, but Dispatcher/Store delivered accepted count changes only at 07:10. B store confirms 20 units at 07:15; receipt-confirmed count increases separately. The storyboard may focus on truck completion while C remains an explicitly outstanding separate trip; do not label the entire depot day complete.

## Future-capacity illustration

For D10 only, use an independently authored future-week row: `Illustrative week 1`, Peliyagoda, Fresh, total 100 m³, chilled 30 m³, source `Authored prototype scenario — not a trained forecast`. A note can say `Review refrigerated capacity for this week`; no calculated fleet/driver number, confidence interval or model accuracy is shown. This is not a Task 2A submission or a substitute for actual forecast rows.
