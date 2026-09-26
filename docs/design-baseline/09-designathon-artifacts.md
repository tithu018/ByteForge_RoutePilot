# Designathon artifact plan, storyboard, AI disclosure and tradeoff

Status: specifications/drafts ready for review. High-fidelity frames, clickable prototype, exported design file, ZIP and actual video are **not yet created**. The user requested a Design Baseline before those steps.

## Design-file identity and page structure

File: `<TEAM_NAME>_Designathon`. Cover: `<SOLUTION_NAME> — Waypoint delivery operations`. Baseline version `DB-0.1`, approval date pending. The tool is a design decision; Figma is a suitable proposal, not a competition requirement or a tool already used here.

| Page | Contents and required artifacts |
|---|---|
| 00 — Cover and review map | Product/team placeholders, challenge context, role map, baseline version, contents, prototype entry links, legend Official/DD/Optional/Illustrative |
| 01 — Problem framing and scope | Fragmented planning, shared capacity, repeated skips, loading feedback, POD disputes, offline continuity; selected priorities and deliberate exclusions |
| 02 — Personas | Four persona cards from document 01; working environment, goals, pain points, decisions and cross-role dependencies; mark as synthesized, not interviewed |
| 03 — Information architecture | Role navigation; all 38 canonical screens; contextual drawers/states; access boundaries |
| 04 — Connected flows and state models | F01–F08, eight lifecycle models, cross-role propagation, local vs server vs receipt distinctions |
| 05 — Design system | Tokens, type, spacing, components, status vocabulary, responsive examples, accessibility notes; style guide is officially optional but included as useful handoff |
| 06 — Shared experience | S01–S04, relevant variants, rationale paragraph per screen |
| 07 — Dispatcher | D01–D11; overview, dense planning, constraints, deferrals, revisions, progress, future capacity; rationale per screen |
| 08 — Loader | L01–L06; tablet + phone flows; shortage/damage/change/readiness states; rationale per screen |
| 09 — Driver | V01–V10; mobile route/stop/outcome/POD; rationale per screen |
| 10 — Store Manager | M01–M07; phone and selected desktop compositions; order, notice, receipt/issues; rationale per screen |
| 11 — Degradation and recovery | Named F08 sequence, reason it matters, online/offline/reload/sync accepted/duplicate/conflict/retry branches; local storage failure; visual references to V08/V09 and D09 |
| 12 — Connected prototype | Four role entry points; connected judge story, testable branches, return-to-flow controls outside product UI if necessary; instructions identifying simulated behavior |
| 13 — Core tradeoff | One-page explanation below; optional official deliverable |
| 14 — Assumptions and traceability | Screen-requirement map, pending data decisions, exact cutoff/POD/scenario assumptions, official vs DD ledger |
| 15 — AI disclosure | Honest draft below, updated to actual tools/work; assisted and unassisted work separated |
| 16 — Submission and change log | Master checklist, prototype/video links, export manifest, deadline and later significant-departure register |

### Frame and annotation naming

`<SCREEN_ID> / <screen name> / <viewport> / <state>`; example `V08 / Offline Active Delivery / 390 / After reload`. Component variants use semantic names such as `Button / Primary / Loading`, not arbitrary numeric labels.

Every canonical screen gets its own rationale paragraph adjacent to frames. Reused components and variants point to their parent rationale; additional genuinely new screens require a new ID and paragraph. Keep review annotations outside the product canvas so operational users do not see implementation details.

### Required frame states

- One default frame for each canonical screen, plus relevant empty, initial loading, error, invalid input and changed-context variants specified in its screen entry.
- Not every variant needs to be shown in the short video, but every critical branch must be inspectable in the file/prototype.
- Desktop anchor frames: D01, D02, D03, D04, D07, D09, D11; show representative mobile adaptations and document all remaining responsive rules.
- Loader phone frames for **every** L screen; tablet anchor L01/L02/L05/L06.
- Driver phone frames for **every** V screen; 320px checks on V03/V06/V08/V09.
- Store phone frames for every M screen; desktop M01/M02/M05/M06.
- Degradation frames must use the same stop/order identities and consistent timestamps/counts across the entire sequence.

### Prototype entry points

1. `Complete four-role delivery` — F01.
2. `Capacity shortage and repeated deferral` — F03.
3. `Loading shortage and changed plan` — F04.
4. `Driver offline delivery and recovery` — F08, with branch chooser on the presentation page, not inside product UI.
5. `Store receipt discrepancy` — F06.

Changing role in the design presentation is a review affordance, clearly outside application frames. The later working app uses authenticated accounts rather than an unrestricted role switch.

## Primary degradation scenario statement

**Driver loses connectivity during an active delivery.** Waypoint's field coverage can fail along the Kandy corridor, hill country and rural districts while the Driver still needs outlet restrictions and a durable handover record. The design keeps a downloaded trip usable, saves arrival/outcome/POD locally, demonstrates those records after an offline reload and makes reconciliation outcomes understandable. This matters because a lost record can create a dispute and because an unsynced local success must not falsely tell the Dispatcher or store that shared records are current. The prototype models these states; actual persistence, deduplication and conflict handling will require Hackathon implementation and tests.

## Designathon demo-video storyboard

Target **4 minutes 40 seconds**, within the official 3–5 minute limit. Actual submission must be an **unlisted YouTube video**, not this script. Narration describes a high-fidelity prototype honestly; do not claim backend/offline storage already works. Keep cursor movements purposeful, text readable and pauses long enough to see the decision.

| Time | Visual / interaction | Narration objective and suggested content |
|---|---|---|
| 00:00–00:15 | Cover → four-role flow | “Waypoint shares a constrained fleet across three brands. Our design connects the decision to send an order with loading, delivery and receipt.” Identify product/team when approved. |
| 00:15–00:40 | Persona strip, device contexts, scope page | Explain Dispatcher desktop, Loader shared dock device, Driver personal phone/offline, Store counter. State priority: feasible decisions, clear handoffs and recoverable field work rather than numerous disconnected dashboards. |
| 00:40–01:05 | M02 → M03 → M05 | Place illustrative order; show 16:00 cutoff and confirmation distinct from scheduling. Point out separate dry/chilled orders are possible. Mention exact cutoff boundary is an implementation assumption. |
| 01:05–01:45 | D02 → D03 → D07 → D11 | Show weight and volume together, reefer/van eligibility, delivery windows/fuel checks and prior skip history. Demonstrate one blocked assignment and explained deferral, then complete publication coverage. |
| 01:45–02:15 | L01 → L02 → L03 → L05/L06 | Show stop-oriented loading, shortage report and current-plan review. Explain that readiness changes are explicit, not an outdated printed checklist. Include one short comparison state without dwelling on every field. |
| 02:15–03:30 | V02 → V03 → V08/V04–06 → simulated reload → V09 | Name primary degradation scenario. Lose connection; open cached stop; record arrival/outcome/POD; see local-save receipt; reopen after modelled offline reload; reconnect. Show accepted state and brief duplicate/conflict/retry branch thumbnails, including preserved evidence and Dispatcher review route. Say “These prototype frames specify persistence and reconciliation behavior; implementation will verify it.” |
| 03:30–04:00 | D08 and M05 → M06 → D08 | Show that only accepted sync updates the other roles. Store confirms receipt separately; Dispatcher sees delivery plus receipt. A discrepancy path is available. |
| 04:00–04:25 | D10, tradeoff and assumptions | Forecast-informed planning is represented without claiming trained-model integration. Explain manual/assisted validated planning versus premature optimization; receiver/POD format and authored fixtures are design decisions. |
| 04:25–04:40 | AI disclosure → submission links | State what AI assisted, what team review/design work actually occurred and remaining assumptions. End on prototype navigation map so judges know where branches live. |

### Video production checklist

- Use approved design frames, not a terminal or prose document as a substitute for high-fidelity work.
- Replace narration placeholders with actual team/product names.
- Include assumptions and design rationale, not only a feature tour.
- Record captions or provide clear spoken narration; readable zoom/cursor and consistent audio.
- Keep video between 3:00 and 5:00 after editing; verify playback after YouTube processing.
- Set Unlisted; verify the submitted URL opens without team-account access.
- Do not expose real account secrets or confidential dataset content outside organizer-approved scope.
- Submit the actual video URL in the Designathon form.

## AI tool disclosure draft — truthful as of DB-0.1

**Tool used:** OpenAI Codex assistant in this workspace. Record the exact model/version from the environment if known; do not invent it.

**AI-assisted work:** The assistant read the user-provided master prompt and the locally supplied official Challenge Booklet; prepared and revised requirements traceability, architecture and domain/API/offline planning; and drafted the product personas, information architecture, design system, screen specifications, state models, flows, compliance checklist and demo storyboard in this Design Baseline. Persona details beyond the booklet are explicitly design hypotheses, not user interviews. The assistant used local document extraction and file tools to create/review documentation. No application source code was written during this phase.

**Human contribution so far:** The user supplied the challenge materials and scope, corrected the work sequence, approved the requirements/architecture direction and requested a Designathon-first baseline. The team has not yet confirmed final naming, approved this baseline, created the final high-fidelity prototype or recorded the actual video within this work record. Do not claim those activities as completed human work.

**Work not AI-assisted:** To be completed truthfully by the team after actual design/prototyping/review. List specific independently performed activities only if they occurred; `Not yet recorded` is more accurate than invented claims of interviews, usability testing or manual design.

**Review and responsibility:** The team will review official-rule references, distinguish design decisions, validate fixture consistency and approve the final submitted design. Add actual review outcomes and dates after they happen.

**Data handling:** No competition CSV datasets were supplied or uploaded during this Design Baseline phase. The booklet and user instructions were available in the assistant workflow. Before any later use of datasets or derivatives in third-party tools/hosting, resolve the booklet's confidentiality conditions. Do not claim that all future AI/data usage is approved by this disclosure.

**Future updates required:** Add design tools actually used, any image-generation assistance, code assistance in later phases, actual human-only work and any permitted data-processing/model tools. Keep phase-specific disclosures aligned with actual work rather than copying claims between submissions.

## Core design tradeoff explanation — one-page draft

**Chosen tradeoff: explainable assisted planning and dependable handoffs before automatic optimization and expansive analytics.** Waypoint's main risk is not the absence of a sophisticated route graphic: it is that a decision made in the office does not arrive intact at the dock, on the road or at the store. We therefore center the Dispatcher workspace on confirmed demand, feasible vehicle/trip assignments and explicit deferral reasons, while the Loader and Driver see small focused task flows. The two physical capacities, refrigeration, access, delivery windows, depot, daily trip limit and fuel allowance remain visible and validated; the system does not claim a globally optimal plan.

This costs some automation and visual breadth. An experienced Dispatcher still makes prioritization decisions, optional maps/photo signatures are omitted from the baseline, and future-capacity views disclose forecast provenance rather than invent resource precision. In return, the design can explain why an order was deferred, distribute the current plan version and preserve delivery evidence through connection loss. Local recording, accepted synchronization and store receipt are separate milestones, adding a little state complexity to avoid false assurances. The result is a coherent scope that can be prototyped convincingly and implemented faithfully by the Hackathon deadline. Automatic optimization, richer POD media and trained-model integration can be added later without replacing these core handoff contracts.

## Submission obligations

Official Designathon deadline: **29 September 2026, 23:59 Asia/Colombo**. Export the design file with base `<TEAM_NAME>_Designathon`, compress as `<TEAM_NAME>_Designathon.zip`, submit through `https://forms.gle/H6dqUZP6pXdGC8Go8`, and supply prototype/video links. Verify current form fields at submission time; this document does not claim the form has been inspected or a submission made.

The file format depends on the chosen design tool; the booklet does not mandate Figma, PDF-only export or a fixed screen count. Select an export that preserves inspectable required pages and provide the interactive prototype link separately. Preserve the exact submitted version for Hackathon fidelity review; record significant later deviations in the future README.
