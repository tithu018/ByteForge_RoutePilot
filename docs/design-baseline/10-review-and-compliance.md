# Review, compliance, traceability and next-phase order

## A. Designathon master checklist

Legend: **Specified** = present in this documentation, not a completed visual artifact. **Pending** = work not performed. No checkbox below claims a competition submission is complete.

| Requirement / baseline item | Source | Current status and evidence | Completion condition |
|---|---|---|---|
| Product placeholder/naming structure | User; booklet pp.10,12 | Specified in README | User chooses actual team/solution names before final packaging |
| Four grounded personas | p.9 | Specified in 01 | Four persona pages/cards in design file |
| Connected four-role workflows | pp.6–9 | Specified in 01 and 08 | Clickable high-fidelity normal flow |
| Scope and prioritization | p.9 | Specified in 01 and tradeoff | Approved scope shown clearly |
| Complete navigation/inventory | User; p.9 | 38 screens in 01 and 03–07 | Approved navigation, no orphan primary actions |
| Detailed wireframes/content/actions | User | Textual compositions and exact field lists in 03–07 | Visual frames created and reviewed |
| Empty/loading/error/validation states | User | Every screen has explicit fields | Relevant state frames and links |
| Responsive/phone use | User; role contexts pp.6–7 | 02 and every screen | Phone Loader/Driver frames and responsive anchors |
| One paragraph rationale per screen | p.9 | 38 individual paragraphs in 03–07 | Present alongside every submitted screen |
| Named degradation scenario + rationale | p.9 | 08 F08 and 09 | Fully developed high-fidelity offline/recovery sequence |
| Offline reload and safe sync recovery | pp.4–7; user | 08 complete sequence | Prototype models accepted/duplicate/conflict/retry; implementation tests later |
| Design system | User; official style guide optional | 02 specified | Visual component variants and accessibility review |
| State models, all eight domains | User | 08 | Approved state wording and guards |
| High-fidelity prototype | p.9 | Pending | Chosen design tool, complete linked flows, accessible share link |
| Design-file distinct pages | p.10 | 17-page structure in 09 | Actual organized design file/export |
| 3–5 minute unlisted YouTube video | p.9 | 4:40 storyboard in 09 | Actual recording/upload and tested URL |
| AI disclosure | pp.9–10 | Honest draft in 09 | Updated to actual work and included in design file |
| Core tradeoff ≤1 page/diagram | p.9, optional | Draft in 09 | Optional approved artifact |
| Exact base/ZIP naming | p.10 | Structure specified | `<TEAM_NAME>_Designathon` and `.zip` actual files |
| Prototype/video URLs and ZIP submitted | p.10 | Pending | Form receipt verified before deadline |
| Day 5 baseline preserved | pp.3,10,12 | Version policy specified | Freeze submitted file/link/version and retain change log |
| Official data consistency | p.7 | Data contract specified; actual files absent | Inspect records locally; consistent approved fixtures |
| Confidentiality conditions | p.22 | Known unresolved hosting/tool issue | Resolve before transmitting datasets/derivatives externally |

### Judging-aligned review

| Criterion | Weight | Review question and evidence |
|---|---|---|
| Problem framing | 25% | Does 01 explain operational problems and 08 show how the connected workflow addresses them? |
| User context | 20% | Do four personas and device-specific screens reflect real booklet conditions? |
| Degradation quality | 15% | Does F08 preserve work through reload and show each reconciliation outcome, not only a banner? |
| Domain accuracy | 10% | Are cutoff, two capacities, refrigeration, access, windows, depot, fuel, routes and calendar represented without invented rules? |
| Scope/prioritization | 15% | Can the submitted design be implemented by Day 10; are optional features excluded honestly? |
| Visual/interaction consistency | 15% | Do actual frames use 02 consistently with accessible hierarchy and connected status language? |

Do not mark visual quality/accessibility as verified before the visual prototype exists.

## B. Screen-to-requirement traceability

Requirement keys below reference official booklet pages rather than falsely claiming the exact screen is mandated.

| Key | Required capability / source |
|---|---|
| Q1 | Four role contexts and connected workflow, pp.6–9 |
| Q2 | Ordering, distinct Fresh orders, confirmation and 16:00 cutoff, pp.4,7 |
| Q3 | Allocation, excess demand, capacity/temp/access/windows/fuel, pp.5,12 |
| Q4 | Depot, vehicle limits, max two routes, operating calendar, pp.3,5,28–29 |
| Q5 | Deferral reasons and previously skipped outlets, pp.4–6 |
| Q6 | Loading stop sequence, missing/damaged goods and shortfalls, pp.4,6–7 |
| Q7 | Driver route, stop outcomes, POD and safe stopped use, pp.6–7 |
| Q8 | Offline field work/reconciliation, pp.4–7; degradation screen p.9 |
| Q9 | ETA/deferral notice, receipt and store issues, pp.6–7 |
| Q10 | Dispatcher progress/problems and feedback, pp.4,6 |
| Q11 | Forecast-informed future capacity, p.7; integration optional p.15 |
| Q12 | Designathon screen rationale/prototype, pp.9–10; phone-responsive Hackathon continuity p.12 |
| Q13 | Four seeded accounts and working web experience, p.12; exact access/recovery UI is DD |

| Screen | Requirement(s) | Concrete evidence to show in prototype |
|---|---|---|
| S01 Sign in | Q1,Q13 | Role-derived entry; no unrestricted role switch |
| S02 Session recovery | Q8,Q13 | Pending work retained, same-account reauthentication |
| S03 Access denied | Q1,Q13 | Scope-safe recovery, no protected record leakage |
| S04 Unavailable/not found | Q8,Q12 | Distinct outage/cache-miss/missing-record recovery |
| D01 Operations Overview | Q1,Q5,Q10 | Scoped progress, exception attention and prior skips |
| D02 Confirmed Orders | Q2,Q4 | Cutoff/eligible runs; dry/chilled records separate |
| D03 Planning Workspace | Q3,Q4,Q5 | Both capacities, eligible vehicle checks, coverage and deferral |
| D04 Trip Detail | Q3,Q4,Q6,Q7 | Ordered stops, window propagation and dock/access details |
| D05 Fleet | Q3,Q4 | Reefer/van/depot, fuel/week, two-trip accounting |
| D06 Outlet Detail | Q3,Q5,Q6 | Windows/access, separate daily orders and service history |
| D07 Deferrals | Q5,Q9 | Reason, repeated skips, reconsideration without history loss |
| D08 Delivery Progress | Q7,Q9,Q10 | Server-received evidence and store receipt distinct |
| D09 Exceptions | Q6,Q8,Q10 | Recorded remedy; original/current sync-conflict comparison |
| D10 Future Capacity | Q11 | Provenance, total/chilled view, explicit assumptions |
| D11 Publication | Q1,Q3,Q5,Q6 | Complete order coverage and current instructions |
| L01 Assigned Loads | Q1,Q6,Q12 | Current trip/version on phone and tablet |
| L02 Load Checklist | Q6,Q12 | Stop sequence, quantities and local line feedback |
| L03 Loading Exception | Q6,Q10 | Missing/damaged/short report before departure |
| L04 Loading Issue | Q6,Q10 | Dispatcher response and authorized recheck |
| L05 Plan Change | Q1,Q6 | Affected lines compared and rechecked |
| L06 Readiness | Q1,Q6 | Explicit current-load handoff; exact gate is DD |
| V01 Today’s Trips | Q7,Q8,Q12 | Assigned/downloadable trip with cache status |
| V02 Active Trip | Q7,Q8 | Next stop, current readiness and progress |
| V03 Stop Detail | Q3,Q7 | Window, dock/access and correct order identity |
| V04 Arrival | Q7,Q8 | Actual arrival durably recorded, early wait distinguished |
| V05 Outcome | Q7,Q8 | Actual delivery facts without premature shared completion |
| V06 POD | Q7,Q8 | Durable outcome/evidence metadata, format explicitly DD |
| V07 Delivery Issue | Q7,Q8,Q10 | Offline issue and not-yet-shared feedback |
| V08 Offline Active Delivery | Q8,Q12 | Cached content, recording and post-reload preserved evidence |
| V09 Sync Center | Q8,Q10 | Accepted/duplicate/conflict/retry/auth recovery |
| V10 Trip Completion | Q7,Q8 | Local finish versus reconciled completion |
| M01 Store Overview | Q2,Q9 | Upcoming arrivals and receipt/deferral attention |
| M02 Create Order | Q2,Q4 | Requested date, quantities, temp and cutoff behavior |
| M03 Confirmation | Q2 | Stable order acceptance, not a scheduling promise |
| M04 History | Q2,Q9 | Distinct orders and receipt/issue state |
| M05 Order Detail | Q5,Q9 | Honest ETA, deferral notice, delivery timeline |
| M06 Receipt | Q9,Q10 | Expected/delivered/received comparison, discrepancy branch |
| M07 Store Issue | Q9,Q10 | Actionable report and confirmed submission |

Every row also maps to Q12's per-screen rationale requirement; rationales are in documents 03–07. OPTIONAL partial/failed outcome detail, POD media, maps and optimization are not falsely mapped as official obligations.

### Previous inventory → final inventory

| Previous IDs / capability | Final destination |
|---|---|
| Shared S01–S04 | Same IDs/concepts |
| Old D01 Overview | D01 |
| Old D02 Order Queue | D02 |
| Old D03 Planning | D03 |
| Old D04–05 Availability/Capacity and D15 Vehicle Detail | D05 and D03 inspector |
| Old D06–07 Trip Builder/Route Sequence | D04, initiated from D03 |
| Old D08 Validation | D03 inspector, D04 checks and D11 final review |
| Old D09–10 Deferred/History | D07 |
| Old D11–12 Delivery Progress/Detail | D08 |
| Old D13 Exceptions | D09 |
| Old D14 Outlet | D06 |
| Old D16 Future Capacity | D10 |
| Old D17–18 Summary/Publication | D11 |
| Old L01–02 Dashboard/Assigned | L01 |
| Old L03–06 Load/Sequence/Checklist/Status | L02 |
| Old L07–09 Missing/Damaged/Short | L03 and L04 |
| Old L10 Readiness | L06 |
| Old L11 Changed Plan | L05 |
| Old V01–02 Home/Trips | V01 |
| Old V03–04 Active/List | V02 |
| Old V05–07 Stop/Restrictions/Window | V03 |
| Old V08 Arrival/Start | V04 and V05 |
| Old V09–10 Outcome/POD | V05 and V06 |
| Old V11 Issue | V07 |
| Old V12 Partial/Failed | Optional future V05 variant; not committed baseline |
| Old V13 Offline | V08 |
| Old V14–15 Pending/Result | V09 |
| Old V16 Completion | V10 |
| Old M01–03 Dashboard/Create/Confirmation | M01–03 |
| Old M04 History | M04 |
| Old M05–08 Detail/Status/ETA/Deferred | M05 |
| Old M09 Receipt | M06 |
| Old M10 Issue | M07 |

## C. Missing decisions requiring user approval

The following are explicit proposals for baseline review, not claims that the booklet prescribes them. User approval of DB-0.1 can accept the defaults together; there is no need to approve each minor token individually.

| Decision | Proposed default | Consequence if changed |
|---|---|---|
| Overall screen scope | Approve 38 canonical screens and documented variants; optional partial/failed completion excluded | Additional screens need rationale, flows and implementation capacity |
| Visual direction | Light-first Inter/deep-blue operational system, no dark-mode scope | Alternative typography/brand palette requires contrast/component review |
| Team and product names | Keep placeholders until supplied | Required before final exports/repository naming, not before wireframe review |
| Prototype tool | Figma or another approved high-fidelity design tool; no tool assumed already connected | Determines artifact export/sharing process |
| POD minimum | Receiver acknowledgement/name + driver attestation + time/order/quantity; no signature/photo | User must approve minimum evidence format; attachments add storage/sync/prototype work |
| Receiver unavailable | Preserve draft and record issue; do not fabricate completion | If partial/failed delivery must be finalized, approve that optional lifecycle branch |
| Planning interaction | Manual/assisted assignment with validation; no optimizer | Automatic solver adds algorithm/UX scope not needed for compliance |
| Loading handoff | Current-version checklist + blocking-issue gate; Driver starts only after online current-readiness check | Offline departure authorization would need an explicit safety/staleness policy |
| Cutoff | Server receipt before 16:00 qualifies; at/after boundary following run; requested date retained | Exact boundary not specified by booklet; document chosen convention |
| Future-capacity prototype | Explicit illustrative volumes/provenance and planning notes; no trained-model claim or automatic fleet count | Real forecast integration depends on later datasets/models |
| Offline session | Preserve pending work across expiry; same identity to sync; cached viewing policy explicitly approved later | Security/usability balance must be resolved before implementation of offline authentication |
| Fixture data | Independently authored, labelled scenario until official local data approved | Actual shared data must ultimately be used consistently; external sharing requires confidentiality resolution |

### Dataset-dependent decisions — do not block approval of visual system, do block unsupported claims

- Inspect actual outlet/mall windows and Fresh-before-08:00 cases before choosing a precedence for contradictions.
- Confirm operational fuel-week accounting and route-distance/return assumptions; Task 2B formula remains a separate mode and is not implemented in this UX phase.
- Inspect available order/item/address fields before finalizing official-data populated frames.
- Resolve organizer permission for transmitting datasets/derivatives to design tools, repositories, hosted demos or public/unlisted videos. This document does not authorize external transfer.
- Assess any supplied data amendments and form requirements before submission; no external forms or datasets were opened during baseline drafting.

## D. Recommended order for creating the high-fidelity prototype

1. **Approve this baseline and defaults.** Confirm product/team placeholders, POD policy, optional scope and design tool.
2. **Review the fixture manifest and create the visual identity skeleton.** Document 11 supplies coherent illustrative record IDs, times, quantities and event counts; map later approved official references without inventing their restrictions.
3. **Create design tokens and component variants.** Type, color, spacing, input/error states, tables/cards, capacity bars, stop cards, banners, timelines and sync rows. Test contrast before mass frame creation.
4. **Build the two anchor experiences.** D03 desktop planning and V03/V08 phone stop/offline views. Review hierarchy and content density before extending the system.
5. **Build the main cross-role sequence.** M02/M03 → D02/D03/D04/D11 → L01/L02/L06 → V01/V02/V03/V04/V05/V06 → M05/M06 → D08.
6. **Build the complete degradation prototype.** V08 local saving + after-reload frames, V09 accepted/duplicate/retry/auth/conflict branches, D09 review and final cross-role reconciliation. This is a first-class deliverable, not late polish.
7. **Build deferral and loading exceptions.** D06/D07, L03/L04/L05, D09; demonstrate source history and current-plan acknowledgment.
8. **Complete remaining screens.** D01/D05/D10, V07/V10, M01/M04/M07 and S01–S04. Verify every screen has its rationale and a useful next action.
9. **Apply responsive and accessibility review.** Every Loader/Driver screen on phone; representative Dispatcher mobile/tablet; Store phone/desktop; keyboard alternatives and large-text checks.
10. **Wire complete prototype entry points.** No dead primary buttons; simulation controls kept outside product UI; illustrative data and simulated offline persistence disclosed.
11. **Review all state branches and traceability.** Check against 38 screen entries, all eight state models and Q1–Q13; reconcile quantities/counts/timestamps and no fake operational analytics.
12. **Create personas/rationale/flow pages and supporting artifacts.** Assemble distinct pages, tradeoff and accurate AI disclosure; freeze candidate version.
13. **Record actual 4:40-target video.** Follow storyboard, explain assumptions, test unlisted URL.
14. **Export/package/submit.** Correct base filename/ZIP, prototype/video access, final checklist and deadline. Preserve submitted design version for Hackathon fidelity.

## Handoff acceptance for the next approval

Approve the baseline only when the team agrees the main flow, evidence states, POD choice, deferral/shortage handling and screen scope are coherent. High-fidelity visual quality is evaluated in the next artifact phase; documentation alone cannot certify it. Backend/database/application implementation remains explicitly out of scope until separately authorized in the controlled sequence.
