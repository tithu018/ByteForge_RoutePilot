# Store Manager screen specifications

Use plain language and show only authorized outlet information. Desktop and phone receive the same capabilities with different density. Store forms are online-first in this baseline; failed submission preserves input but is never labelled confirmed before server acceptance.

## M01 — Store Overview

- **SCREEN ID:** M01
- **SCREEN NAME:** Store Overview
- **ROLE:** Store Manager.
- **PURPOSE:** Understand upcoming deliveries and actions needing store attention.
- **PRIMARY USER DECISION:** Create an order, inspect an arrival/deferral or confirm a receipt.
- **INFORMATION SHOWN:** Outlet identity and selected date; cutoff for requested next service date; upcoming order cards with confirmation/scheduling state, planned/expected arrival provenance, temperature and reference; deferred notice; delivered orders awaiting receipt; open store issues. No fleet-wide figures.
- **COMPONENTS:** Simple header; primary `Create order`; `Arriving`/`Needs attention`/`Recent` sections; small timestamp; receipt CTA on relevant card.
- **PRIMARY ACTIONS:** Create order; open order; confirm receipt when eligible.
- **SECONDARY ACTIONS:** View history; change authorized outlet/date; open issue.
- **VALIDATION:** Scope bound to authorized outlet; absence of ETA is not rendered as zero time; requested date not mistaken for guaranteed date.
- **ERROR STATES:** `Couldn't update your deliveries`; preserve previous data with freshness; no store-wide outage disguised as no orders.
- **EMPTY STATES:** `No orders for this date` → create/history; no receipt actions → omit empty attention card rather than show celebratory metrics.
- **LOADING STATES:** Order-card skeletons; refresh retains prior cards.
- **RESPONSIVE BEHAVIOR:** Desktop narrow primary content plus optional attention column; phone single column, create action accessible without covering order cards.
- **DATA SOURCE:** Scoped Order/PlanDecision, trip arrival projection, Delivery, ReceiptConfirmation and Issue.
- **WHAT OTHER ROLE IS AFFECTED:** Navigation only until Store creates, confirms or reports; those actions affect Dispatcher.
- **RATIONALE PARAGRAPH:** The Store Manager should not have to interpret fleet-planning terminology to know what is coming. A small set of order and attention cards turns operational status into useful decisions about ordering and receipt. Explicit arrival provenance prevents an unconfirmed plan from becoming a false promise to the outlet.

## M02 — Create Order

- **SCREEN ID:** M02
- **SCREEN NAME:** Create Order
- **ROLE:** Store Manager.
- **PURPOSE:** Submit a distinct order for an authorized outlet and requested date.
- **PRIMARY USER DECISION:** What goods/quantity and temperature handling to request for which service date.
- **INFORMATION SHOWN:** Outlet/brand/depot read-only; requested date; brand schedule guidance; temperature choice; description/order units; weight kg and volume m³ where needed for planning; current cutoff and eligible-run explanation; review summary. No invented SKU catalogue, price, tax or payment fields.
- **COMPONENTS:** Labelled form grouped `Delivery request` and `Goods`; date picker using operating calendar; numeric inputs with units; contextual cutoff banner; inline errors and submit summary; primary `Submit order`.
- **PRIMARY ACTIONS:** Validate and submit once; route to M03 on authoritative acceptance.
- **SECONDARY ACTIONS:** Cancel; preserve unsent form during recoverable errors; review entered values. Separate dry/chilled orders for one day are allowed, not merged.
- **VALIDATION:** Required outlet/date/temp/units and trustworthy planning quantities; positive units, nonnegative quantities, applicable operating-date guidance; no arbitrary maxima invented; validate latest cutoff on server. If cutoff passes while editing, show changed eligibility and require acknowledged resubmission rather than silently alter request.
- **ERROR STATES:** Field error summary focuses first field; submission failure retains values; ambiguous timeout checks request identity before retry to avoid duplicate order; no fabricated confirmation offline.
- **EMPTY STATES:** No authorized outlet → access/support state; no calendar data → cannot assert an eligible date, show retry; first form otherwise normal empty entry.
- **LOADING STATES:** Reference/calendar skeleton; `Submitting order…`; entered content retained.
- **RESPONSIVE BEHAVIOR:** Desktop max-720px form; phone stacked fields and numeric keypad; date/control labels wrap; submit remains reachable above keyboard.
- **DATA SOURCE:** Authorized outlet/reference calendar, user input and order confirmation result.
- **WHAT OTHER ROLE IS AFFECTED:** Dispatcher receives accepted order in the appropriate intake queue; Loader/Driver only after planning.
- **RATIONALE PARAGRAPH:** The order form captures what allocation needs without inventing a retail checkout system. Clear units, temperature and cutoff context improve demand quality while preserving the requested date. Explicit late-cutoff review makes the consequence understandable and avoids treating a received order as already scheduled.

## M03 — Order Confirmation

- **SCREEN ID:** M03
- **SCREEN NAME:** Order Confirmation
- **ROLE:** Store Manager.
- **PURPOSE:** Prove acceptance and explain what happens next.
- **PRIMARY USER DECISION:** Review the order or return to other work.
- **INFORMATION SHOWN:** `Order confirmed`; stable reference; submitted/confirmed time; outlet, requested date, temp, units/weight/volume; planning-run eligibility; `Not scheduled yet` until publication. After-cutoff variant: `Received after cutoff. This order will be considered in the following run.`
- **COMPONENTS:** Calm confirmation icon; compact facts; timeline beginning Order received/Confirmed; `View order`; secondary `Create another order`.
- **PRIMARY ACTIONS:** View M05.
- **SECONDARY ACTIONS:** Create another separate order; return home; copy order reference (no unnecessary export).
- **VALIDATION:** Only display after accepted server result; repeated submit response maps to same reference; never promise ETA or new date without source.
- **ERROR STATES:** If response unknown, render `Checking whether your order was received` recovery, not success; lookup failure links to history/retry with retained request identity.
- **EMPTY STATES:** No confirmed order context → history/create; cannot show empty success.
- **LOADING STATES:** Checking confirmation indicator; accepted details remain stable once obtained.
- **RESPONSIVE BEHAVIOR:** One-column readable summary; long IDs wrap; primary view action full width on phone.
- **DATA SOURCE:** Server Order/intake confirmation result and corresponding timeline.
- **WHAT OTHER ROLE IS AFFECTED:** Dispatcher queue already updated by acceptance; opening confirmation triggers no new mutation.
- **RATIONALE PARAGRAPH:** The old process lacked clear acknowledgement, so confirmation deserves an explicit screen. It communicates acceptance without overstating scheduling and makes late-cutoff treatment understandable. A stable order reference gives both the Store Manager and Dispatcher a shared object for later questions.

## M04 — Order History

- **SCREEN ID:** M04
- **SCREEN NAME:** Order History
- **ROLE:** Store Manager.
- **PURPOSE:** Find an order and understand its current outcome.
- **PRIMARY USER DECISION:** Which order needs inspection or receipt action.
- **INFORMATION SHOWN:** Requested date, order ref, temperature, units, fulfillment state, current scheduled/planned arrival if any, deferral indication, receipt status and issue overlay. Separate records at the same outlet/date remain visible.
- **COMPONENTS:** Search by reference; date/status filters; desktop compact table; phone order cards; pagination; `Create order` secondary action.
- **PRIMARY ACTIONS:** Open order M05.
- **SECONDARY ACTIONS:** Clear filters; create another order; change authorized outlet.
- **VALIDATION:** Correct outlet scope; filters use requested date unless explicitly labelled otherwise; search does not expose other stores.
- **ERROR STATES:** Read failure retains filter/scroll and previous results; stale records show updated time.
- **EMPTY STATES:** `No orders yet` → create; `No orders match your filters` → clear; distinguish both.
- **LOADING STATES:** Skeleton rows/cards; preserve current page during refresh.
- **RESPONSIVE BEHAVIOR:** Phone cards emphasize date, ref, state and action; avoid wide scroll table; filters in accessible sheet when necessary.
- **DATA SOURCE:** Scoped Order projections, PlanDecision, Delivery and receipt status.
- **WHAT OTHER ROLE IS AFFECTED:** Read-only; follow-up actions affect Dispatcher/Driver records only through explicit flows.
- **RATIONALE PARAGRAPH:** History provides a dependable route back to an order without requiring the Store Manager to remember its planning run. Distinct fulfillment, deferral and receipt information explains why two orders for the same day may differ. Filters and stable references support practical follow-up rather than dashboard browsing.

## M05 — Order and Delivery Detail

- **SCREEN ID:** M05
- **SCREEN NAME:** Order and Delivery Detail
- **ROLE:** Store Manager.
- **PURPOSE:** Explain scheduling, deferral, delivery evidence and receipt status in one place.
- **PRIMARY USER DECISION:** Prepare for arrival, understand deferral or confirm/report what arrived.
- **INFORMATION SHOWN:** Order/outlet/date/temp/quantities; confirmation; published schedule and planned/expected arrival labelled by source; last update; deferral reason and next consideration when known; timeline; driver-delivered quantity/POD summary; receipt state; relevant issues. Internal dispatcher notes excluded unless intentionally shared.
- **COMPONENTS:** Order summary; context banner (scheduled/deferred/delivered); chronology; receipt card; issue link. Deferral subview uses `Deferred for this run`, human-readable reason and no invented delivery promise.
- **PRIMARY ACTIONS:** `Confirm receipt` → M06 when driver record accepted; open issue/report when relevant.
- **SECONDARY ACTIONS:** Inspect history; return to orders; view delivery metadata.
- **VALIDATION:** Driver-delivered does not auto-confirm receipt; no live ETA claim from static planned time; revised plan updates expected arrival with changed timestamp; unknown next run explicitly stated.
- **ERROR STATES:** Partial timeline/evidence loading failure; stale status banner; record not accessible routes to S03/S04 without leaking detail.
- **EMPTY STATES:** Confirmed but unplanned → `Scheduling pending`; no ETA → `Arrival time not available yet`; no receipt → `Awaiting your confirmation` only after eligible delivery record.
- **LOADING STATES:** Summary/timeline skeleton; refresh retains old schedule with stale marker until authoritative new data.
- **RESPONSIVE BEHAVIOR:** Desktop summary + timeline; phone stacked with key expectation first and receipt CTA visible; timeline labels wrap.
- **DATA SOURCE:** Order, published allocation/deferral, arrival projection, accepted Delivery/POD, ReceiptConfirmation and scoped Issue.
- **WHAT OTHER ROLE IS AFFECTED:** Read-only; receipt/report actions update Dispatcher; Driver record remains separate evidence.
- **RATIONALE PARAGRAPH:** Stores need a coherent account of what happened, not disconnected status chips. The detail screen connects acceptance, plan changes, delivery and receipt while explaining gaps honestly. Deferral is treated as a meaningful notice, and driver evidence is shown as something the Store Manager can confirm or dispute rather than an automatic final truth.

## M06 — Confirm Receipt

- **SCREEN ID:** M06
- **SCREEN NAME:** Confirm Receipt
- **ROLE:** Store Manager.
- **PURPOSE:** Record the outlet's account of what arrived.
- **PRIMARY USER DECISION:** Does receipt match the driver's delivery record, or is there a discrepancy?
- **INFORMATION SHOWN:** Order/outlet, expected units, driver-reported units/time, receiver evidence summary; received quantity; `Matches delivery record` confirmation; discrepancy note/action; identity of confirming store user.
- **COMPONENTS:** Side-by-side quantities on desktop, stacked comparison phone; received-quantity input; explicit confirmation; `Confirm receipt` or `Report discrepancy` depending input.
- **PRIMARY ACTIONS:** Submit receipt once; discrepancies create linked issue through M07 or atomic receipt-with-issue flow.
- **SECONDARY ACTIONS:** Return to order; inspect driver metadata; edit unsent quantity.
- **VALIDATION:** Authorized outlet; accepted delivery record; nonnegative received quantity; mismatch requires explanation/issue; prevent duplicate receipt; previously confirmed record requires explicit correction trail rather than overwrite.
- **ERROR STATES:** Delivery changed during review; receipt save failure retains input; ambiguous timeout checks original submission identity.
- **EMPTY STATES:** No eligible delivered record → `Receipt confirmation is not available yet`; if goods physically arrived before driver sync, allow issue/report route rather than fabricated delivery record.
- **LOADING STATES:** `Confirming receipt…`; no success before server acceptance.
- **RESPONSIVE BEHAVIOR:** Phone large quantity control and one primary button; comparison labels remain visible with keyboard; max-720px desktop form.
- **DATA SOURCE:** Accepted Delivery/POD, Order, user-entered receipt and resulting ReceiptConfirmation/Issue.
- **WHAT OTHER ROLE IS AFFECTED:** Dispatcher sees receipt/discrepancy; Driver evidence retained; Driver may see relevant issue outcome without editing store statement.
- **RATIONALE PARAGRAPH:** Receipt closes the cross-role loop and must preserve the store's independent account. Comparing expected, delivered and received quantities exposes discrepancies before confirmation. The flow avoids overwriting Driver evidence and produces a clear operational follow-up when the two accounts differ.

## M07 — Report Store Issue

- **SCREEN ID:** M07
- **SCREEN NAME:** Report Store Issue
- **ROLE:** Store Manager.
- **PURPOSE:** Report a delivery or receipt problem tied to an order.
- **PRIMARY USER DECISION:** What happened and which goods/expectation were affected?
- **INFORMATION SHOWN:** Outlet/order/delivery context; proposed types `Missing goods`, `Damaged goods`, `Quantity discrepancy`, `Delivery timing`, `Other`; quantity where relevant; short description; existing linked issues to avoid accidental duplicates; submission status.
- **COMPONENTS:** Short structured form; contextual quantity comparison; optional draft receipt link; confirmation panel with issue reference.
- **PRIMARY ACTIONS:** `Report issue`.
- **SECONDARY ACTIONS:** Return to order; open an existing related issue; cancel unsent report.
- **VALIDATION:** Required type and actionable details; quantity within meaningful context; other requires description; issue does not independently rewrite driver outcome or planning decision.
- **ERROR STATES:** Failed send retains fields and says `Issue not sent`; cutoff is irrelevant here and must not block reporting; repeated retry uses same request identity.
- **EMPTY STATES:** No order context → choose an authorized order; no previous issues is a normal state.
- **LOADING STATES:** `Sending report…`; confirmation only after accepted response.
- **RESPONSIVE BEHAVIOR:** Single column, large type selector, numeric keypad where needed; clear primary/secondary hierarchy.
- **DATA SOURCE:** Order/Delivery/Receipt context, Issue creation and subsequent scoped issue history.
- **WHAT OTHER ROLE IS AFFECTED:** Dispatcher receives exception; Driver/Loader may be involved through recorded follow-up; no external email/SMS integration assumed.
- **RATIONALE PARAGRAPH:** The outlet needs a clear way to flag problems without returning to unstructured phone calls. A short contextual report produces useful operational evidence while preserving the original delivery record. Explicit send confirmation makes the reporting experience as trustworthy as order acknowledgement.
