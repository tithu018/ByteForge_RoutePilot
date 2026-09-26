# State models, cross-role flows and offline recovery

## Interpretation

All application lifecycle states and transitions in this document are **DESIGN DECISIONS**. Official concepts include confirmed orders, served/deferred allocation, proof of delivery, receipt and offline reconciliation; the booklet does not prescribe these complete enums or transition mechanics. Source-file `attempted/deferred/not_run` retain their official historical meanings and are not reused as a live lifecycle.

Use independent dimensions instead of one giant status: order fulfillment, planning disposition, issue presence, store receipt and synchronization. A locally recorded delivery with pending sync and an open issue can exist without contradiction. `Served` means allocated in a plan, not proof of delivery.

## 1. Order model

Persisted order lifecycle is distinct from an unsent form. An online form draft belongs to the user's session, not the confirmed demand queue.

| From → to | Trigger / actor | Guard and visible consequence |
|---|---|---|
| Unsent form → Awaiting confirmation | Store submits | Preserve request identity; no confirmed reference until server accepts |
| Awaiting confirmation → Confirmed | Accepted order | Requested date unchanged; assign eligible intake run; Store sees M03, Dispatcher D02 |
| Confirmed → Planned | Dispatcher publishes served decision | Trip/stop assigned; Store sees schedule, Loader/Driver receive current plan |
| Confirmed or Planned → Deferred | Published decision/revision | Reason required; remove future active allocation only through valid revision; history preserved |
| Deferred → Confirmed for reconsideration | Order admitted to following run | Prior deferral retained; no automatic promise or duplicate order identity |
| Planned → Loading | Loader begins current load | Store/Dispatcher projection updates after accepted loading event |
| Loading → In transit | Driver departure accepted | Current readiness/assignment checked; actual departure distinct from planned |
| In transit → Delivered | Complete delivery + required POD accepted | Store receipt action becomes available; not automatically receipt-confirmed |
| Any eligible active state → same state + Issue reported | Issue created | Underlying fulfillment remains visible |

Validation/save failures leave the last confirmed state unchanged. Driver local progression appears on that device as `Recorded on this device`; server-facing Order does not jump to Delivered until sync acceptance. Partial/failed delivery final states are optional and not used to hide an unresolved baseline issue.

## 2. Plan model

| From → to | Trigger / actor | Guard / visibility |
|---|---|---|
| Draft → Validation required | Create/edit allocation, vehicle, sequence or deferral | Prior validation invalidated; private planning view |
| Validation required → Ready to publish | Current full validation passes | Every eligible order served/deferred; operating constraints pass |
| Validation required → Draft with blockers | Validation fails | Focused remedies; no field instructions distributed |
| Ready to publish → Published | Dispatcher publication succeeds | Atomic recheck and version commit; downstream updates |
| Ready to publish → Validation required | Any edit/resource change | Cannot reuse previous green result |
| Published → Revision in progress | Dispatcher begins changes | Existing published version remains current until replacement committed |
| Revision in progress → Published new version | Same full validation/publication | Old version Superseded; affected Loader acknowledgement/readiness invalidated |
| Published → Closed | Execution and required exception review complete | Preserve history; store receipt status remains independently queryable |

`Superseded` belongs to an old version, not a silent deletion of the plan. A cancelled revision leaves the prior version current. Published stops already delivered cannot be retrospectively rearranged as if work never occurred.

## 3. Trip model

| From → to | Trigger / actor | Guard / result |
|---|---|---|
| Draft → Assigned | Plan publication | Current vehicle, orders and driver association |
| Assigned → Loading | Loader starts | Current published version |
| Loading → Ready | Readiness accepted | Current acknowledgement; required checklist complete; no blocking loading issue (DD) |
| Ready → Loading / Review required | New relevant revision or critical issue | Driver departure no longer presented as ready |
| Ready → In progress | Driver starts trip online | Final current readiness check; max-route/fuel planning already validated |
| In progress → Locally finished | Driver records all required stop outcomes offline/online | Local-only milestone; still pending sync if unacknowledged |
| In progress / Locally finished → Completed | Server accepts all required completion events | Material conflicts resolved; receipt dimension separate |

Trip `On hold` is an overlay for a blocking condition, not an automatic cancellation. A route that cannot finish needs Dispatcher exception handling; the baseline must not mark unserved stops complete to close it.

## 4. Loading model

| Level | Transitions | Guard / consequence |
|---|---|---|
| Trip load | Not started → In progress | First acknowledged loading event |
| Line | Unchecked → Loaded | Expected quantity explicitly confirmed |
| Line | Unchecked/Loaded → Missing, Damaged or Short | Factual exception report; quantities and prior value preserved |
| Issue correction | Exception line → Recheck required → Loaded | Authorized remedy followed by Loader evidence; no silent clearing |
| Trip load | In progress → Review required | Relevant plan revision, unresolved critical issue or incomplete required line |
| Trip load | In progress/Review required → Ready | Latest-version acknowledgement and all required checks pass |
| Trip load | Ready → Review required | New relevant change before departure |

`Damaged` and `Short` are operational report categories, not inventory accounting. A quantity cannot be double-counted across categories without an explicit overlap explanation. The physical loading-order rule is not universally assumed to be reverse stop sequence; display the required unloading order and support practical checking.

## 5. Delivery model

| From → to | Trigger | Guard / visible result |
|---|---|---|
| Not started → Arrived | Driver confirms arrival | Correct order/stop; durable event; early arrival allowed |
| Arrived → Waiting | Arrival before opening | DD view derived from window, not extra delivery failure |
| Arrived/Waiting → Handling | Driver starts handling after access is available | Keep waiting separate from handling; no automatic completion |
| Handling → Outcome draft | Driver records delivered quantities | Local draft not yet a final delivered event |
| Outcome draft → Recorded complete locally | Outcome + POD metadata persisted atomically | Explicit local-save receipt; pending sync badge if needed |
| Recorded complete locally → Accepted complete | Server accepts / recognizes identical event | Dispatcher/Store update once |
| Recorded complete locally → Needs reconciliation | Server detects conflict | Evidence retained; no false completion shared |

Issue reporting can occur alongside Arrived/Waiting/Handling without completing delivery. Late arrival is a fact and an issue/risk; do not invent a rule that physically prevents recording a late handover. Task 1's supplied scenario delivers late arrivals; operational incident handling remains distinct from validating future plans.

Store receipt: `Awaiting store confirmation → Confirmed` or `Discrepancy reported`. Both retain the Driver record. A corrected receipt is a new audited correction, not an overwrite of original evidence.

## 6. Deferral model

| From → to | Trigger | Guard / result |
|---|---|---|
| Proposed | Dispatcher chooses deferral in draft | Reason and supporting constraint/history visible; Store not yet promised a change |
| Proposed → Published | Plan committed | Store notice, decision timestamp/actor and run retained |
| Published → Pending reconsideration | Following run becomes relevant | Same order identity; prior skipped outlet remains visible |
| Pending reconsideration → Reconsidered/served | New plan allocates order | Historical deferral remains, current fulfillment proceeds |
| Pending reconsideration → Deferred again | New explicit decision | New decision linked to previous; update history, no duplicate order |

No fixed priority score or maximum consecutive skips is an official rule. Proposed reason codes and consequence notes support explanation; if next scheduled time is unknown say so.

## 7. Issue model

| From → to | Actor / action | Guard / result |
|---|---|---|
| Local draft → Open | Report accepted; offline Driver report first persists locally | Local unsynced issue is labelled not yet shared |
| Open → Acknowledged | Dispatcher reviews | Reporter sees receipt when refreshed/synced |
| Acknowledged → Action in progress | Corrective action recorded | Linked plan/loading/delivery context and owner |
| Open/Acknowledged/Action in progress → Resolved | Authorized resolution | Factual reason and remedy; no deletion of original report |
| Resolved → Reopened | New evidence invalidates remedy | Retain earlier resolution and explain renewed action |

Severity and resolution permissions are DD. Loader records recheck evidence; Dispatcher resolves planning/critical operational issues. Store issue visibility is scoped. No external messaging is sent automatically by the design.

## 8. Offline Sync model

Connectivity (`Online`, `Offline`, `Unknown/checking`) is independent of per-event processing.

| From → to | Trigger | Invariant / user feedback |
|---|---|---|
| Unsaved → Saving locally | Driver confirms action | UI does not claim durable success yet |
| Saving locally → Pending sync | Durable transaction succeeds | `Saved on this device at <time>. Not yet shared.` |
| Saving locally → Local save failed | Quota/storage/write failure | Retain input, no completion badge, explain recovery |
| Pending sync → Syncing | Connection + valid session + dependencies | Automatic foreground retry or explicit user retry |
| Syncing → Synced: accepted | Server receipt | Remove from pending once; update projections |
| Syncing → Synced: already received | Matching event previously committed | `Already received. No duplicate delivery was created.` |
| Syncing → Retry needed | Temporary failure/no response | Retain same event ID and payload; backoff; retry safely |
| Syncing → Sign-in required | Authentication expired | Preserve queue; S02; same identity resumes |
| Syncing → Needs review | Stale assignment/version or incompatible state | Preserve original evidence; route to Dispatcher review |
| Needs review → Synced: resolved | Authorized reconciled decision | Accept/correct using explicit audit, then notify Driver |
| Needs review → Retained unresolved/rejected | Evidence cannot apply | Explain reason; do not discard or mark delivered; issue stays actionable |

A duplicate acknowledgement is successful reconciliation, not a red error. Reusing an event ID with different contents is not a duplicate success. Block dependent completion until prerequisite arrival/outcome records are accepted or explicitly reconciled; unrelated deliveries may continue syncing.

## Cross-role propagation matrix

| Event | Actor / source screen | Dispatcher sees | Loader sees | Driver sees | Store sees |
|---|---|---|---|---|---|
| Order confirmed | Store M02–03 | D02 eligible queue | Nothing yet | Nothing yet | M03 reference + eligibility |
| Plan published | Dispatcher D11 | Current version/coverage | L01–02 current load | V01 assigned trip | M05 scheduled or deferred |
| Order deferred | Dispatcher D07/D11 | Reason/history | Excluded from assigned load | Excluded from route | M05 notice + next consideration |
| Loading starts | Loader L02 | Loading progress | Saved checklist | Readiness still pending | Loading if server projection supports it |
| Missing/damaged/short report | Loader L03 | D09 exception | L04 acknowledgement | Hold/readiness explanation | Relevant delay only when established, not invented ETA |
| Plan revised | Dispatcher D11 | New version | L05 recheck | Changed plan; preserve existing events | Updated schedule/notice |
| Loading ready | Loader L06 | Ready status | Current acknowledgement | V02 departure review enabled | Does not imply in transit |
| Departure accepted | Driver V02 | In progress | Load handed over | Active route | In transit |
| Arrival saved offline | Driver V04/V08 | Last received facts only | No change | Local arrival + pending | Last received facts only |
| Delivery/POD saved offline | Driver V06/V08 | No fabricated update | No change | Local recorded result | No receipt prompt yet |
| Delivery/POD accepted | V09 sync | D08 evidence/actual time | Relevant completion if exposed | Synced | M05 delivered + M06 available |
| Duplicate replay | V09 sync | No duplicate event | No change | Already received | No duplicate prompt |
| Conflict | V09 sync | D09 review | Only if correction affects load | Needs review; evidence safe | Last accepted state, not conflicted claim |
| Receipt confirmed | Store M06 | Receipt complete | No mutation | Delivery evidence remains | Confirmation timestamp |
| Receipt discrepancy | Store M06–07 | D09 issue | Relevant correction only | Relevant issue context | Discrepancy and tracking |

Prototype annotations show propagation. In implementation, connected refresh/invalidation/polling is a chosen mechanism, not a promise of instantaneous push or a prescribed API architecture.

## Complete end-to-end flows

### F01 — Normal connected delivery

S01 Store → M01 → M02 (before cutoff, distinct order) → M03 → M05 pending scheduling → S01 Dispatcher → D02 → D03 assign vehicle/trip → D04 sequence/check timing → D11 validate/publish → Store M05 scheduled → Loader L01 → L02 load each order → L06 ready → Driver V01 download → V02 readiness/start → V03 stop → V04 arrival → V05 outcome → V06 POD → V09 accepted → V10 finish → Store M05 → M06 receipt → Dispatcher D08 final delivery and receipt.

Acceptance: identity, quantities, trip version and times agree across all role views; no extra seeded shortcuts are needed to reach the final state.

### F02 — Cutoff passes during order entry

M02 opened before 16:00 → server submission occurs at/after proposed cutoff boundary → form retained with following-run explanation → Store acknowledges changed eligibility → accepted once → M03 displays actual requested date and following-run status → Dispatcher D02 Following run tab. Do not automatically change requested date or claim next-day delivery.

### F03 — Capacity exceeded and repeated deferral

D02 identify prior skip → D06 history → D03 try eligible vehicle → D08-style validation within D03 shows independent volume/weight/resource violation → D07 choose explainable deferral/consequence → D11 publishes complete coverage → M05 notice → next run D07 reconsider → assign if feasible or explicitly defer again. Preserve all decisions and source order identity.

### F04 — Loading shortage and correction

L02 quantity check → L03 Missing/Damaged/Short → Dispatcher D09 acknowledges → record remedy (replace goods or revise allocation) → if replacement: L04 recheck → L02 correct quantity → D09 resolution → L06 current readiness. If plan changes: D03 revision → D11 publication → L05 compare/recheck → L06. Do not allow Loader to silently reduce order or grant readiness despite unresolved hold.

### F05 — Vehicle unavailable after planning

D05 status change identifies affected trips → D09 operational issue → D03 create revision/reassign or defer → D04 validate → D11 publish → L05 current plan review → V01/V02 updated assignment; Store M05 revised schedule or deferral. Driver work already recorded is retained and reconciled; not overwritten by reassignment.

### F06 — Store discrepancy

Accepted driver delivery → M05 → M06 received amount differs → M07 issue details → server stores receipt/discrepancy and linked issue without changing original driver evidence → D09 correction workflow → M05 issue history. If physical goods arrive before driver sync, Store can report the situation but must not fabricate accepted Driver evidence.

### F07 — Future-capacity planning

D10 select depot/brand/horizon → review total and chilled volume with provenance → inspect constrained future week → record explicit resource-planning assumption/note. Trained model integration and numerical fleet conversion are optional; no model accuracy or staffing sufficiency claim is fabricated.

## F08 — Primary degradation: Driver loses connectivity during an active delivery

The high-fidelity prototype must provide a full clickable sequence and named branch variants below. Transition labels are prototype annotations, not fake operational controls inside the final product.

| Step / frame | Screen and exact visible content | Driver action | Persistence / other roles |
|---|---|---|---|
| 01 Online active trip | V02: Online; trip version; `Available offline`; next stop/window | Open next stop | Complete bundle already downloaded; Dispatcher/Store show latest accepted state |
| 02 Connectivity lost | V03/V08: `Offline · 0 actions pending`; `Using saved trip version <v>` | Continue without modal interruption | Cached data remains; no new server claim |
| 03 Cached stop opened | V08: outlet/order/window/access/units identical to online | Select `Record arrival` | No network dependency for cached facts |
| 04 Arrival recorded | V04: actual captured device time; early/late context | Confirm arrival | Local event committed before success |
| 05 Arrival local receipt | V08: `Arrival saved on this device at <time>. Not yet shared.`; pending count 1 | Continue delivery | Dispatcher/Store still last accepted state |
| 06 Outcome captured | V05: expected/delivered quantity and explicit outcome | Continue to POD | Draft durable; final completion not yet claimed |
| 07 POD captured | V06: proposed receiver acknowledgement, attestation, handover time, note | Save delivery record | Outcome + POD atomically stored with stable event identity; count based on sync events, not form fields |
| 08 Local delivery receipt | V08: `Delivery recorded on this device`; evidence summary; pending count | Return to trip | UI does not say shared/receipt-confirmed |
| 09 Offline reload | App closes/reloads while offline | Reopen app | App shell opens local data; no network spinner dependency |
| 10 Persistence verified | V08 shows same arrival, outcome, POD summary, version and pending count | Open saved record then Sync | No duplicate event created by viewing/reload |
| 11 Connectivity restored | V09: Online; pending actions remain visible | Foreground sync starts automatically; retry action if needed | Session checked; no premature empty queue |
| 12 Sync in progress | V09: `Syncing <processed> of <total> actions` | Driver may return to cached trip | Dependency order preserved; original timestamps retained |
| 13A Accepted | `Delivery record synced` | View result | Server commits once; Dispatcher D08 and Store M05 receive accepted state |
| 13B Duplicate acknowledgement | `Already received. No duplicate delivery was created.` | Continue | Lost response replay resolves to original result; one delivery only |
| 13C Conflict | `Your delivery record is saved. The plan changed while you were offline. Review is needed.` | Inspect evidence/current context; request review | Queue retains unresolved record; Dispatcher D09 receives review item; Store sees last accepted state |
| 13D Retry | `Couldn't send <n> actions. They are still saved on this device.` | Retry or continue trip | Same event IDs; controlled retry after transient failure; dependent records stay pending |
| 13E Auth expired | `Sign in again to sync. Saved actions remain on this device.` | S02 same-account recovery | No reattribution or deletion |
| 14 Conflict resolved | D09 records decision; V09 receives reconciliation result | Review result | Accepted evidence linked explicitly; original event retained; incompatible evidence stays unresolved with reason |
| 15 Successful reconciliation | V09: `All recorded actions are synced. Last synced <time>.` | Return trip/V10 | Pending count zero only when acknowledged; separate store receipt state |
| 16 Other-role verification | D08 actual occurrence + received time; M05 delivered/receipt action | Store M06 confirms receipt | Final Dispatcher view shows delivered + receipt confirmed, not merely queued |

### Durability and conflict specification

- A durable local transaction is the boundary for `Saved on this device`. A visual checkbox before that boundary is only input, not success.
- An event envelope identifies actor/device, order/delivery, trip/plan version, local occurrence time, stable unique event ID and factual payload. User-facing UI does not expose these technical fields except understandable references/times.
- Outcome/POD form drafts survive navigation; the final completion event contains the required evidence atomically. An orphan POD draft must not mark an order delivered.
- Pending count counts unique unsynchronized operations, not retries or individual metadata fields. The main prototype uses three events: arrival, handling start, and atomic outcome/POD completion. Its exact counts and times are specified in document 11; changing event granularity later requires updating all prototype counts consistently.
- Multi-tab or app-resume retry must not process the same event into duplicate delivery. Server acknowledgements remain authoritative; identical replay is safe even if local coordination fails.
- If a plan was revised while offline, do not automatically reject all factual work or silently accept an incompatible assignment. Preserve it and apply a documented reconciliation decision.
- Driver may inspect and explain a conflict but cannot override allocation authority. Dispatcher compares original evidence/current plan and records the decision in D09.
- Partial-batch results are retained per event. Accepted records stay accepted when a later record fails. Independent records can continue while dependent ones wait.
- Store sees only accepted delivery data. A conflict does not cause a new false receipt prompt.
- No `Clear pending records` escape hatch. An unresolved/rejected event remains in review/history with a reason; it is not falsely counted as successfully delivered.

### Additional degraded variants to design

| Condition | Visible state | Recovery |
|---|---|---|
| No downloaded trip | `This trip is not available offline` | Connect and download; do not fabricate details |
| Storage write fails/full | `This action was not saved` | Preserve current input; retry/local-storage support; no green success |
| Browser storage evicted | `Saved trip data is unavailable on this device` | Reconnect and reconcile known server records; disclose local persistence limits |
| Network flaps | Pending/syncing state settles per acknowledgement | Backoff, durable queue, no duplicate event generation |
| Plan changes after Loader opened it | L05 affected-line comparison | Recheck before readiness |
| Receiver acknowledgement unavailable | POD draft retained; issue action | Record issue; do not fabricate receiver evidence |

Only F08 must be fully developed as the selected Designathon degradation scenario. L05 and other critical variants support a coherent product; they should not displace the quality of F08 in the time-limited demo.

## Interaction verification for the future prototype

- Walk F01 across all four role accounts/frames without dead ends.
- Walk F08 including modelled post-reload persistence frames and all named sync result branches; label prototype simulation honestly. Actual browser reload durability is a later implementation test, not proven by clickable frames.
- Confirm every primary action has a destination/result, every error a next step, and every state identifies whether the record is local or shared.
- Check keyboard order, large text, 320px layout, table-to-card conversion and sticky footer/keyboard collision in design reviews.
- Confirm all illustrative quantities, statuses, clocks and identities reconcile across frames; no real-data claims before official import review.
