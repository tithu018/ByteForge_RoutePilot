# Design system and interaction contracts

Everything in this document is a **DESIGN DECISION**, unless a specific behavior is traced to the booklet. These specifications apply to every screen; screen files state additional variations. They are suitable for Figma or another design tool and later implementation, but do not constitute source code.

## Visual direction

Light-first enterprise interface with a restrained deep-blue accent, warm-neutral surfaces and strong typographic hierarchy. A dark navy navigation rail anchors the Dispatcher desktop workspace. Field screens use bright, high-contrast content and minimal chrome. Borders and alignment do more work than shadows. Do not use gradients, glass effects, decorative sparklines, fake maps or invented percentage changes.

Visual hierarchy: page purpose → operational decision → essential record identifiers → constraint or next action → supporting details. A status badge never substitutes for an explanation or next step.

## Color tokens

| Token | Value | Intended use |
|---|---|---|
| canvas | `#F5F7FA` | Page background |
| surface | `#FFFFFF` | Work panels, forms, cards |
| surface-subtle | `#EEF2F6` | Group headers, quiet backgrounds |
| text-primary | `#172B4D` | Main text |
| text-secondary | `#475569` | Secondary text |
| text-muted | `#64748B` | Nonessential metadata; verify size/contrast |
| border | `#D8E0E9` | Nonessential separators |
| control-border | `#64748B` | Input boundaries and meaningful controls |
| nav | `#122238` | Desktop navigation |
| nav-text | `#F8FAFC` | Navigation labels |
| accent | `#1D4ED8` | Primary button, links, selected state |
| accent-hover | `#1E40AF` | Hover/pressed primary |
| accent-tint | `#EFF6FF` | Selected row/context |
| success-text / tint | `#166534` / `#F0FDF4` | Confirmed success |
| warning-text / tint | `#92400E` / `#FFFBEB` | At risk, deferred, needs attention |
| critical-text / tint | `#B91C1C` / `#FEF2F2` | Blocking problem |
| info-text / tint | `#1E40AF` / `#EFF6FF` | Informational status |
| focus | `#2563EB` | 2px ring plus 2px contrasting offset |

Colors are proposed tokens, not a claim of completed accessibility testing. Verify actual foreground/background pairings in the high-fidelity file: WCAG 2.2 AA target of 4.5:1 for normal text and 3:1 for large text/meaningful nontext controls. Do not place white small text on light amber/green. Status meaning always appears in words and iconography.

## Typography and numeric formatting

- Typeface: Inter, with system sans fallback. Use one family; no display face. Font availability/licensing must be checked when producing the design file.
- Page title: 28/36px semibold desktop; 24/32px mobile.
- Section title: 20/28px semibold; card title 16/24px semibold.
- Body/form labels: 14/20px desktop, 16/24px field mobile. Field essential instructions never use 12px.
- Metadata: 12/16px desktop, 14/20px mobile. Buttons 14/20px desktop, 16/24px mobile.
- Operational quantities use tabular numerals. Units stay adjacent: `1,250 kg`, `12.4 m³`, `34.0 L`; preserve source precision in detail and validate using unrounded values.
- Times: `07:20`; display service date and `Sri Lanka time` near scheduling controls. Long-form confirmation dates avoid ambiguous `09/10` notation.
- ETA: `Expected 07:20` with provenance and `Updated 06:48`. If only a planned arrival exists use `Planned arrival 07:20`, not a live-tracking claim.
- Counts are whole numbers. Unknown quantity is `Not available`, not `0`. Freshness is explicit on operations and offline screens.

## Spacing, dimensions and responsive grid

- Base spacing 8px; allowed 4, 8, 12, 16, 24, 32, 40, 48 and 64px. Four-pixel steps are for compact internal alignment only.
- Desktop page padding 32px, tablet 24px, mobile 16px. Content gaps 24px; field form groups 24px.
- Desktop sidebar 224px; top header 64px. Tablet rail 72px with accessible labels/tooltips; phone navigation 64px plus safe area.
- Twelve-column desktop grid, eight-column tablet, four-column phone; field reading column max 560px, forms max 720px, broad operations content max 1600px where useful.
- Corners: controls 8px, cards 12px, sheets 16px top corners; avoid pill-shaped containers except status chips.
- Elevation: flat content panels; one restrained shadow on menus/drawers/dialogs. Do not elevate every card.
- Minimum clickable target 44×44px; Driver/Loader primary actions 48px tall minimum, preferably 52px. Visible icons may be 20px inside a larger target.
- Desktop table rows 48px default; compact mode 40px only for Dispatcher and with adequate targets. Field lists use 72px minimum where two lines are needed.

| Width | Behavior |
|---|---|
| 1440+ | Dispatcher three-pane planning: order queue ~320px, flexible trips, constraints ~320px |
| 1024–1439 | Two panes; constraint details open as side drawer; key totals remain visible |
| 768–1023 | Compact nav; planning uses Orders/Trips/Checks tabs; Loader list + detail when space permits |
| 320–767 | One column; cards instead of dense tables; full-width sheets; safe-area-aware primary action |

Test reference frames at 1440×1000, 1024×768, 768×1024, 390×844 and 320×568. Support zoom/reflow and dynamic text; fixed heights must not clip errors. These are design test sizes, not competition-prescribed resolutions.

## Component specifications

| Component | Anatomy and variants | Behavior |
|---|---|---|
| Button | Primary blue, secondary outlined, quiet text, destructive red; icon + label | One primary action per decision area; loading retains width/label; disabled reason remains accessible |
| Input/select | Persistent label, value, optional helper, error | No placeholder-only labels; errors beside field and in submit summary; numeric keypad for quantities |
| Status chip | Icon, text, optional count | Never interactive unless visually disclosed; no color-only distinction |
| Metric | Label, computed count, scope, link | No decorative trend. Clicking opens filtered source records |
| Table | Select, identifier, key facts, state, action | Sticky header; sort indicators; explicit column labels; row action also keyboard accessible |
| Field card | Identity, window/quantity, state, next action | Whole-card navigation plus separately labelled action without nested conflicting targets |
| Capacity bar | Label, used/max, remaining or excess | Separate weight and volume bars; over-limit marker and text; do not silently cap the numeric overflow |
| Constraint list | Severity icon, rule, actual/limit, affected entity, remedy | `Blocking` vs `Advisory`; click focuses relevant trip/order |
| Timeline | Event, actor/role, time, evidence/source | Separate planned events, server-confirmed events and local unsynced events |
| Stop row | Sequence, outlet/order, window, dock/access, status | Keyboard move-up/down alongside drag if included; one order per imported stop |
| Drawer/sheet | Title, context, body, footer | Desktop side drawer; phone full-width sheet; focus returns to trigger |
| Dialog | Specific title, consequence, primary and cancel | Only irreversible/material decisions; do not confirm every checkbox |
| Banner | Icon, short summary, effect, action | Persistent for offline, stale plan and blocking context; no automatic dismissal |
| Toast | Short result, optional undo/view | Noncritical feedback only; critical errors remain inline; live-region announcement |
| Tabs/filter bar | Selected state, result count, clear filters | Filter state in context; empty-filter state differs from no data |
| Pagination | Range, next/previous, page size | No infinite scroll for planning lists needing stable selection |
| Sync row | Record/action, local time, processing state, next step | Unique events counted once; duplicate acknowledgement is successful reconciliation |

## Status language

All application status enums below are **DD**. Official words such as served/deferred describe requirements; their use here does not make this entire lifecycle an official schema.

- Order display: `Awaiting confirmation`, `Confirmed`, `Planned`, `Loading`, `In transit`, `Delivered`, `Deferred`. `Issue reported` is an overlay, not a replacement for fulfillment state.
- Planning disposition: `Unassigned` (draft only), `Served` (allocated for the run), `Deferred`. Served/deferred are official allocation concepts; these transitions are DD.
- Plan: `Draft`, `Validation required`, `Ready to publish`, `Published`, `Revision in progress`, `Superseded`, `Closed`.
- Vehicle availability: `Available`, `Unavailable / Workshop`; utilization separately `Unassigned`, `Assigned`, `Loading`, `In transit`. A vehicle can remain available while assigned; do not collapse independent dimensions.
- Loading: `Not started`, `In progress`, `Review required`, `Ready`; item/order lines: `Unchecked`, `Loaded`, `Missing`, `Damaged`, `Short`.
- Delivery: `Not started`, `Arrived`, `Handling`, `Recorded complete`; server reconciliation and store receipt appear separately.
- Receipt: `Awaiting store confirmation`, `Confirmed`, `Discrepancy reported`.
- Issue: `Open`, `Acknowledged`, `Action in progress`, `Resolved`; severity `Info`, `Warning`, `Critical` is DD.
- Sync: `Saved on this device`, `Pending sync`, `Syncing`, `Synced`, `Needs review`, `Retry needed`, `Sign-in required`. Connectivity `Online/Offline` is independent.

## Common state and validation contracts

**Loading:** show structural skeletons for initial reads, not fictitious metric values. Keep current data visible during refresh with an updating indicator and last-success time. Mutation buttons say `Saving…` or `Publishing…`; navigation remains possible only if work is safely preserved.

**Empty:** distinguish no records, no matching filters, no assignment and unavailable data. Each has a next step. `No matching orders. Clear filters` is different from `No confirmed orders for this run`.

**Error:** retain form inputs. State what failed, whether work was saved, and the next action. Never use a generic toast as the only record of failed saving. Add a copyable support reference when available, never a stack trace.

**Validation:** show field checks on blur and submit, not aggressive errors on first keystroke. Cross-record constraints show server-authoritative checks. Publishing uses latest validation; an old green check cannot authorize a changed plan. Numbers must be nonnegative and within relevant units/limits; no arbitrary minimum weight/volume is invented.

**Stale context:** do not silently replace a form being edited. Show `This plan changed. Review changes before continuing.` Preserve input, compare versions, and request a new decision where needed.

**Accessibility:** semantic headings and landmarks, skip link, visible focus, descriptive labels, accessible sort state and noncolor status. Dialogs manage focus; sheets dismiss by an explicit close action and keyboard Escape where safe. Announce local saves and sync results without reading out every background refresh. Dragging always has buttons as an alternative. Reduced-motion preference removes transition movement.

**Microinteractions:** 120–160ms hover/focus, 180–220ms panel transition, immediate checkbox response followed by truthful save state. No bouncing numbers, celebratory confetti, pulsing alerts or auto-reordering while the user is acting. Use calm success text.

**Safety and mobile:** no auto-advancing stop screens, timed response demands or full-screen distraction on connection change. Driver sees `Use when safely stopped` on trip start and high-level guidance; do not repeat a blocking safety dialog on every action. Keyboard and sticky footer must not overlap inputs or device home indicators.

## Data and content contracts

Every screen file names a logical source, not an implemented endpoint. Live calculations must expose their scope and freshness. Lists use stable source identifiers. Publication and server-confirmed success cannot be simulated by a client-only green badge in the final app.

- Operational overview: counts derived from the same service date/depot and current run. Delivered and deferred can be historical events; do not sum unrelated dates.
- Cutoff: `Orders for <service date> close at 16:00 Sri Lanka time`. After cutoff: `This order will be considered in the following run. Requested date remains <date>.` Do not promise a delivery date before scheduling.
- Capacity: `Weight <used> / <limit> kg · <remaining> kg remaining`; overflow `Over by <excess> kg`.
- Offline: `Offline · <n> actions pending` and `Saved on this device at <time>. Not yet shared.`
- Successful retry duplicate: `Already received. No duplicate delivery was created.`
- Conflict: `Your delivery record is saved. The plan changed while you were offline. Review is needed.`
- Deferral: `Deferred for this run` + human-readable reason + next consideration, without invented guaranteed delivery.

## Prototype data contract

Use one internally consistent authored scenario across role frames. Include one normal ambient order, one chilled order, one van-only order, one explicit deferral, one loading exception and one offline delivery. Combine these into fewer records if coherent; do not invent official outlet restrictions. All numeric demonstrations must reconcile weight, volume, units, totals, stop sequence and event timestamps across frames. Document fixtures in the design file and label them illustrative until approved official source records are substituted.

Prototype annotations may explain data sources and requirements outside the rendered product screen. Never expose developer terminology such as `IndexedDB`, `HTTP 409` or `idempotency key` in field-user UI; use those only in handoff notes.
