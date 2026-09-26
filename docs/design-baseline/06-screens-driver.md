# Driver screen specifications

Phone-first reference frame: 390×844; also test 320×568 and landscape/reflow. All primary actions require safe stopped use. Persistent connection state is independent from save/sync state. Screen V08 is the fully designed degradation variant, not just a banner; document 08 specifies its complete sequence.

## V01 — Today’s Trips

- **SCREEN ID:** V01
- **SCREEN NAME:** Today’s Trips
- **ROLE:** Driver.
- **PURPOSE:** Identify assigned work and prepare it for offline use.
- **PRIMARY USER DECISION:** Which assigned trip to open/download.
- **INFORMATION SHOWN:** Service date; assigned vehicle/depot; trip number/ref, departure, order/stop count, readiness, current version, `Available offline` or `Download needed`; connection and pending-action count; `Use when safely stopped` guidance.
- **COMPONENTS:** Minimal header; trip cards; download progress within each card; bottom Today/Trip/Sync navigation.
- **PRIMARY ACTIONS:** `Open trip`; `Download trip` when necessary.
- **SECONDARY ACTIONS:** Refresh assignments; open sync center; inspect user identity.
- **VALIDATION:** Only assigned trips downloaded; bundle completeness verified before `Available offline`; current readiness checked before departure.
- **ERROR STATES:** Failed/incomplete download keeps `Download needed`; assignment removed appears as a change requiring review; no cached data in airplane mode gives truthful connection requirement.
- **EMPTY STATES:** `No trips assigned today`; offline with no bundle → `Connect to download your assigned trip`.
- **LOADING STATES:** Card skeleton online; download percentage only if measurable, otherwise `Downloading trip…`; cached trips remain accessible.
- **RESPONSIVE BEHAVIOR:** Single-column phone; wider devices center max-560px content; large full-width card action; long vehicle refs wrap.
- **DATA SOURCE:** TripAssignment, readiness/current plan and local bundle manifest.
- **WHAT OTHER ROLE IS AFFECTED:** Download/open is read-only; Dispatcher can see only explicitly implemented acknowledgement, not assumed location tracking.
- **RATIONALE PARAGRAPH:** Offline resilience starts before the connection fails. Showing download completeness alongside the assignment helps the Driver prepare without understanding storage technology. The small number of clear trip cards avoids burying the next action in a desktop-style dashboard.

## V02 — Active Trip

- **SCREEN ID:** V02
- **SCREEN NAME:** Active Trip
- **ROLE:** Driver.
- **PURPOSE:** Follow the assigned sequence and understand trip progress.
- **PRIMARY USER DECISION:** Review readiness/start departure while connected, or open the next outstanding stop.
- **INFORMATION SHOWN:** Vehicle/trip/version, departure state, next stop/outlet, window, access highlights, stops recorded/total, ordered stop cards, local pending count, last plan refresh. No map/GPS estimate unless a later approved feature supplies it.
- **COMPONENTS:** Top trip summary; prominent next-stop card; vertical list; persistent connectivity strip; primary action footer and Sync tab badge.
- **PRIMARY ACTIONS:** `Start trip` when current handoff checks permit; `Open next stop` after departure.
- **SECONDARY ACTIONS:** View all stops/restrictions; open sync center; inspect plan change. Out-of-sequence completion is not silently authorized.
- **VALIDATION:** Current loading readiness and assignment checked for start; start is online-first DD; cached in-progress trip remains usable offline; completed stops cannot be newly completed again.
- **ERROR STATES:** Not ready explains loading issue and returns to waiting state; new version surfaces change; no next stop routes to V10 rather than empty card.
- **EMPTY STATES:** Assigned trip without stops → ask Dispatcher to review; all stops recorded → completion review.
- **LOADING STATES:** Cached bundle renders immediately with freshness; online refresh does not replace the visible stop under the user's finger.
- **RESPONSIVE BEHAVIOR:** One-column phone, 48px rows/actions minimum; bottom action and nav avoid overlap; desktop remains focused rather than becoming dense operations UI.
- **DATA SOURCE:** Trip/stop bundle, loading readiness, local event projection and server acknowledgements.
- **WHAT OTHER ROLE IS AFFECTED:** Accepted departure moves Dispatcher/Store progress to In transit; offline local stop work is shared only after sync.
- **RATIONALE PARAGRAPH:** The trip screen should answer what comes next without encouraging attention while driving. It combines sequence and the next stop with a truthful view of local versus shared progress. Readiness and download checks happen before road work so an active trip can continue through later connectivity loss.

## V03 — Stop Detail

- **SCREEN ID:** V03
- **SCREEN NAME:** Stop Detail
- **ROLE:** Driver.
- **PURPOSE:** Prepare for a specific outlet and record the appropriate next action.
- **PRIMARY USER DECISION:** Record arrival, continue delivery or inspect a completed local record.
- **INFORMATION SHOWN:** Stop number, order/outlet ref, available name/address/district, requested and mall windows, planned arrival, dock type, van/access restrictions, expected units, temperature notes, prior actions and local/server save state. Unknown address explicitly `Address not supplied`.
- **COMPONENTS:** Outlet heading; window/access callouts; order summary; event summary; sticky context-sensitive action `Record arrival`, `Continue delivery` or `View recorded outcome`.
- **PRIMARY ACTIONS:** Open V04 or V05 according to current state.
- **SECONDARY ACTIONS:** Report issue; view full restrictions; return to list; inspect POD for completed record.
- **VALIDATION:** Confirm selected order even when same outlet appears twice; no action auto-submitted on opening; immutable completed evidence corrected through explicit flow.
- **ERROR STATES:** Cache miss explains unavailability; revised assignment requires review; server error does not remove cached detail.
- **EMPTY STATES:** Missing optional instructions → `No additional instructions`; missing mandatory stop/order data blocks completion and preserves other trip data.
- **LOADING STATES:** Cached detail immediate; uncached online skeleton; no spinner when offline cache is available.
- **RESPONSIVE BEHAVIOR:** Essential identity/window/action visible in first viewport; expandable supporting detail; text wraps and primary button remains reachable above safe area.
- **DATA SOURCE:** Cached assigned stop/order/outlet snapshot and local/server delivery events.
- **WHAT OTHER ROLE IS AFFECTED:** Read-only until recording; subsequent delivery records inform Dispatcher and Store.
- **RATIONALE PARAGRAPH:** The Driver needs outlet restrictions before acting, not buried in a separate desktop detail page. Grouping timing, access and expected goods around one order identity reduces mistakes at outlets with multiple deliveries. State-aware actions let the same screen continue naturally online or offline.

## V04 — Record Arrival

- **SCREEN ID:** V04
- **SCREEN NAME:** Record Arrival
- **ROLE:** Driver.
- **PURPOSE:** Capture arrival time without implying delivery completion.
- **PRIMARY USER DECISION:** Confirm arrival at this stop.
- **INFORMATION SHOWN:** Outlet/order, captured device time and date, expected window, `Early arrival: wait until <open>` if applicable, after-close warning, connection/local-save explanation. Time is a recorded event, not GPS proof.
- **COMPONENTS:** Compact confirmation sheet/full phone page; time display; `Confirm arrival`; contextual early/late note.
- **PRIMARY ACTIONS:** Persist arrival locally; continue to V05 when handling can start.
- **SECONDARY ACTIONS:** Cancel; report access issue. Manual time correction is excluded from the minimum flow; discrepancies can be reported rather than silently backdated.
- **VALIDATION:** Assigned stop; no duplicate arrival event; plausible device-time warning if detected, but preserve event evidence; early arrival is permitted and must not be counted as handling.
- **ERROR STATES:** Local-storage failure: `Arrival was not saved. Keep this screen open and try again.` Server unavailable still permits local save; conflicting server state handled in V09.
- **EMPTY STATES:** Missing stop context returns to V03; never records arrival against an unnamed entity.
- **LOADING STATES:** Brief `Saving on this device…`; success only after durable save, then pending/synced indication independently.
- **RESPONSIVE BEHAVIOR:** Large confirm button; no auto-close before accessible success feedback; phone sheet respects keyboard-free layout.
- **DATA SOURCE:** Selected stop, device clock, local outbox/projection and eventual server acknowledgement.
- **WHAT OTHER ROLE IS AFFECTED:** Dispatcher/Store may see arrival after accepted sync; no receipt confirmation implied.
- **RATIONALE PARAGRAPH:** Arrival is a useful operational fact distinct from handling and completed delivery. A small explicit confirmation reduces accidental timestamps and makes early waiting visible. Durable local feedback lets the Driver proceed with confidence even when no network acknowledgement can arrive.

## V05 — Delivery Outcome

- **SCREEN ID:** V05
- **SCREEN NAME:** Delivery Outcome
- **ROLE:** Driver.
- **PURPOSE:** Record the goods handed over and prepare the delivery evidence.
- **PRIMARY USER DECISION:** Is the expected delivery complete, or is there an issue requiring an exception record?
- **INFORMATION SHOWN:** Outlet/order, expected units, arrival/handling state, actual units field defaulting only after explicit confirmation, `Delivered as expected` choice, discrepancy action and short note. Partial/failed outcome variants are OPTIONAL and not disguised as required completion paths.
- **COMPONENTS:** Order summary; `Start handling` when relevant; delivered-units input; confirmation control; issue link; `Continue to proof of delivery` footer.
- **PRIMARY ACTIONS:** Save local outcome draft and open V06; start handling if not yet recorded.
- **SECONDARY ACTIONS:** Report issue V07; return to stop without losing saved draft. Optional partial/failure branch requires later scope approval; minimum branch records issue and leaves completion pending.
- **VALIDATION:** Full-delivery baseline requires expected quantity and explicit confirmation; cannot silently reduce order size; record arrival first; completion not emitted before required POD metadata is committed.
- **ERROR STATES:** Local write failure preserves form with unsaved warning; unsupported discrepancy directs to issue workflow, never forces a false full-delivery result.
- **EMPTY STATES:** Missing expected quantity → show unknown and require issue/review rather than invented units.
- **LOADING STATES:** Local draft save indicator; online sync must not block entering POD after local save succeeds.
- **RESPONSIVE BEHAVIOR:** Single column, numeric keypad, 48px choice targets; keyboard-aware footer; no tiny signature canvas in this baseline.
- **DATA SOURCE:** Cached order, arrival/handling events and local outcome draft.
- **WHAT OTHER ROLE IS AFFECTED:** No premature Delivered status; complete accepted outcome/POD later updates Dispatcher and Store.
- **RATIONALE PARAGRAPH:** Delivery recording must be fast without turning a default value into evidence. The screen separates what was handed over from the customer's later receipt confirmation, and makes discrepancies visible. Keeping outcome and POD as a short connected flow allows local persistence without prematurely marking the delivery complete.

## V06 — Proof of Delivery

- **SCREEN ID:** V06
- **SCREEN NAME:** Proof of Delivery
- **ROLE:** Driver.
- **PURPOSE:** Attach a durable handover record to the delivery outcome.
- **PRIMARY USER DECISION:** Confirm the receiver and handover details are accurate.
- **INFORMATION SHOWN:** Order/outlet, delivered units, occurrence date/time, receiver acknowledgement/name field, optional note, `I confirm these details describe this handover`; connection and storage result. Proposed baseline receiver name is a DD, not an official mandated POD format. No real person's name is needed in illustrative fixtures.
- **COMPONENTS:** Summary, short text field, attestation control, `Save delivery record`, saved-state panel. Signature/photo controls excluded by default.
- **PRIMARY ACTIONS:** Atomically persist outcome + POD metadata + sync event identity; return to stop/trip with `Recorded on this device` or `Synced` as appropriate.
- **SECONDARY ACTIONS:** Back to outcome; report inability to obtain acknowledgement as an issue, preserving draft without pretending complete evidence exists.
- **VALIDATION:** Required proposed receiver acknowledgement, delivered quantity and event identity; no empty attestation; no final local completion until durable transaction succeeds; retry reuses the same event identity.
- **ERROR STATES:** Storage full/write failure → `Delivery record not saved`; server conflict later handled in V09; unavailable network is not a local-save error.
- **EMPTY STATES:** No outcome draft → return to V05; no receiver evidence → explain what's required under chosen POD policy.
- **LOADING STATES:** `Saving on this device…`; after success pending count updates. Do not show `Delivered and shared` before acknowledgement.
- **RESPONSIVE BEHAVIOR:** Short one-column form; input large enough for phone; confirm remains visible after keyboard dismissal; readable summary without pinch zoom.
- **DATA SOURCE:** Outcome draft, locally captured POD metadata/attestation, device time and outbox; eventual Delivery/POD server record.
- **WHAT OTHER ROLE IS AFFECTED:** After acceptance Dispatcher sees delivery evidence; Store sees delivered record and receipt action. Store confirmation stays separate.
- **RATIONALE PARAGRAPH:** A proof-of-delivery record needs more than a checked completion box, but it need not begin with complex image handling. The proposed receiver acknowledgement and driver attestation provide a concise metadata-based baseline, subject to user approval. Clear durable-save feedback is central: the Driver must know whether evidence actually survived the action.

## V07 — Report Delivery Issue

- **SCREEN ID:** V07
- **SCREEN NAME:** Report Delivery Issue
- **ROLE:** Driver.
- **PURPOSE:** Preserve an operational problem at the correct stop, online or offline.
- **PRIMARY USER DECISION:** What prevented or affected delivery and what factual detail is needed?
- **INFORMATION SHOWN:** Trip/stop/order/outlet; proposed types `Access unavailable`, `Receiver unavailable`, `Goods discrepancy`, `Window missed`, `Other`; short note, affected units if applicable, local time, save/share state. Types are DD, not a mandated taxonomy.
- **COMPONENTS:** Large type choices; short conditional fields; save button; local-result panel.
- **PRIMARY ACTIONS:** `Save issue` durably; return to stop with issue overlay.
- **SECONDARY ACTIONS:** Cancel draft; review pending issues; continue permitted delivery recording if issue does not preclude it.
- **VALIDATION:** Type required; other needs note; quantities bounded; issue alone does not mark delivered or defer an order; driver cannot reallocate or erase plan.
- **ERROR STATES:** Local storage failure retains report; sync auth/conflict uses V09; offline text explicitly says Dispatcher has not received it yet.
- **EMPTY STATES:** Missing stop context allows no misattributed report; return to trip selection.
- **LOADING STATES:** Local write feedback; no indefinite network spinner blocking safe offline recording.
- **RESPONSIVE BEHAVIOR:** Large selection rows, optional note expands; phone keypad only for quantity; no automatic camera permission request.
- **DATA SOURCE:** Cached context, local Issue event and server acknowledgement.
- **WHAT OTHER ROLE IS AFFECTED:** Dispatcher receives exception after sync; Store sees relevant delivery issue without internal notes not intended for it.
- **RATIONALE PARAGRAPH:** Issue reporting must work where the issue happens, including without coverage. Short structured choices reduce typing while a retained note carries the context needed for follow-up. Separating an issue from delivery completion and planning deferral prevents field reporting from accidentally rewriting operational decisions.

## V08 — Offline Active Delivery

- **SCREEN ID:** V08
- **SCREEN NAME:** Offline Active Delivery — primary degradation scenario
- **ROLE:** Driver.
- **PURPOSE:** Continue the active delivery through connectivity loss and offline reload.
- **PRIMARY USER DECISION:** Continue with downloaded work and verify each action is safely stored locally.
- **INFORMATION SHOWN:** Persistent `Offline · <n> actions pending`; `Using trip version <v>, downloaded <time>`; same cached stop/window/access/order facts as V03; local arrival/outcome/POD summary; last local save time; `Not yet shared with Dispatcher or store`; uncached/unsupported actions explicitly labelled.
- **COMPONENTS:** Full V03 body with offline header, local-event timeline, saved-state receipt and Sync link. Prototype includes loss-before-arrival, saved-arrival, saved-outcome/POD and post-reload frames; do not replace content with an offline illustration.
- **PRIMARY ACTIONS:** Open cached stop; record arrival; record outcome/POD through V04–V06; reopen saved record after reload.
- **SECONDARY ACTIONS:** View pending actions; retry connectivity; continue next cached stop when allowed. No false `Sync now` success offline.
- **VALIDATION:** Bundle exists; local writes must finish before success; only assigned cached work; dependent records remain linked; no fresh online-only departure authorization while offline in baseline.
- **ERROR STATES:** Storage failure/eviction, missing bundle, session policy restriction and stale-plan notification when later connected each have separate recovery. Never claim browser storage is indestructible.
- **EMPTY STATES:** Cached trip unavailable → explain download prerequisite; zero pending actions still shows Offline, not Synced-to-current-server assurance.
- **LOADING STATES:** Read local store on reload with `Opening saved trip…`; if unavailable show cache error promptly rather than network spinner.
- **RESPONSIVE BEHAVIOR:** Connection strip wraps without covering stop title; save receipt remains readable at 320px; bottom actions safe-area-aware; no connection-loss modal stealing focus.
- **DATA SOURCE:** Verified local trip bundle, local event projection, outbox and last known server version.
- **WHAT OTHER ROLE IS AFFECTED:** None receives new facts until sync; Driver is told this limitation. Dispatcher sees only last received state.
- **RATIONALE PARAGRAPH:** Unreliable coverage is a core business condition, not an exceptional illustration. This screen preserves the same operational information and actions as the online stop while making the boundary of local knowledge explicit. Demonstrating persistence through reload proves that the design protects work, and the share-state wording avoids misleading the Driver about what other roles know.

## V09 — Sync Center and Recovery

- **SCREEN ID:** V09
- **SCREEN NAME:** Sync Center and Recovery
- **ROLE:** Driver.
- **PURPOSE:** Reconcile saved work and explain each unresolved action.
- **PRIMARY USER DECISION:** Wait for safe automatic synchronization, retry a temporary failure or request review of a conflict.
- **INFORMATION SHOWN:** Connection; unique pending event count; last successful sync; per record action/order/local time/status; accepted count; duplicate acknowledgement; conflict reason with saved evidence/current plan summary; retry cause; sign-in requirement. Human wording, no raw HTTP/database jargon.
- **COMPONENTS:** Summary banner; grouped action list `Pending`, `Needs attention`, `Synced`; record detail sheet; retry button; reconciliation result. Exact conflict text: `Your delivery record is saved. The plan changed while you were offline. Review is needed.`
- **PRIMARY ACTIONS:** `Retry sync`; reauthenticate via S02; `Request Dispatcher review` for conflict; review outcome after resolution.
- **SECONDARY ACTIONS:** Return to trip; inspect saved evidence; view last sync. User cannot delete unresolved evidence to make the count green.
- **VALIDATION:** Acknowledged IDs removed once; duplicates with matching payload treated as already received; changed payload under same ID is not silently accepted; dependent events wait behind failed prerequisites.
- **ERROR STATES:** Temporary server error retains event and next retry; auth expiry preserves queue; plan/assignment conflict preserved; local storage fault prevents destructive cleanup; error counts cannot vanish on refresh.
- **EMPTY STATES:** Online with no pending → `All recorded actions are synced`; offline with no pending → `No unsynced actions on this device. Offline.`
- **LOADING STATES:** `Syncing <processed> of <total> actions` if measurable; current event status; no full-screen block on cached trip access.
- **RESPONSIVE BEHAVIOR:** One-column rows; details in full-width sheet; long conflict text wraps; status chip does not squeeze reference unreadably.
- **DATA SOURCE:** Local outbox/results/cursor, server event receipts and conflict-review outcome.
- **WHAT OTHER ROLE IS AFFECTED:** Accepted events update Dispatcher and Store; conflicts create Dispatcher attention; duplicate replay creates no duplicate delivery/receipt prompt.
- **RATIONALE PARAGRAPH:** Synchronization is a recoverable workflow with several outcomes, not a single spinning indicator. Showing what was accepted, what was already present and what needs review builds confidence without exposing implementation internals. Preserved evidence and clear ownership let the Driver continue safely while the Dispatcher resolves genuine planning conflicts.

## V10 — Trip Completion

- **SCREEN ID:** V10
- **SCREEN NAME:** Trip Completion
- **ROLE:** Driver.
- **PURPOSE:** Summarize recorded work and remaining reconciliation obligations.
- **PRIMARY USER DECISION:** Finish the trip locally or address incomplete stops/pending sync.
- **INFORMATION SHOWN:** Trip/vehicle/date; completed-record count vs total; unresolved stops/issues; pending sync count; distinct `All stops recorded on this device` and `Trip reconciled` messages; store receipt status not represented as driver work remaining.
- **COMPONENTS:** Compact completion summary; unresolved list; sync CTA; no confetti, score or invented efficiency statistic.
- **PRIMARY ACTIONS:** `Finish trip` when required stop outcomes exist; `Sync recorded work` when connected; open incomplete stop otherwise.
- **SECONDARY ACTIONS:** Review delivered records; return Today; inspect issue history.
- **VALIDATION:** No silent skipped stops; local finish does not mean server closed; unresolved material conflict prevents `Trip reconciled`; a store receipt is separate and need not block Driver finishing assigned work.
- **ERROR STATES:** Local finish save failure; server rejects current state; pending conflicts link to V09 and retain original records.
- **EMPTY STATES:** Zero-stop trip cannot become a successful delivery demonstration; direct to assignment review.
- **LOADING STATES:** Local completion save then independent sync; no repeated submission on double tap.
- **RESPONSIVE BEHAVIOR:** Single column on all sizes; primary action above safe area; long unresolved list scrolls under stable summary.
- **DATA SOURCE:** Local trip projection, delivery/POD events, sync receipts and server trip state.
- **WHAT OTHER ROLE IS AFFECTED:** Dispatcher sees accepted completion; Store sees delivered orders independently and confirms receipt later.
- **RATIONALE PARAGRAPH:** Completing road work and reconciling its records are related but different milestones. The summary acknowledges work done while keeping unsynced or conflicted evidence visible. This avoids both a false all-clear and an unnecessary dependency on store receipt before the Driver can finish the trip.
