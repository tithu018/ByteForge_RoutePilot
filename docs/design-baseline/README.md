# Design Baseline — <SOLUTION_NAME>

Version: DB-0.1 · 26 September 2026 · Status: awaiting user approval

This is a product UX specification, not an application implementation or completed high-fidelity prototype. No backend, database, application components or migrations are included. The approved requirements verification and the official Tech-Triathlon 2026 Challenge Booklet are the requirements baseline. Booklet page references use printed page numbers.

## Read and review

1. [Product, personas and navigation](01-product-personas-navigation.md)
2. [Design system and interaction contracts](02-design-system.md)
3. [Shared screens](03-screens-shared.md)
4. [Dispatcher screens](04-screens-dispatcher.md)
5. [Loader screens](05-screens-loader.md)
6. [Driver screens](06-screens-driver.md)
7. [Store Manager screens](07-screens-store.md)
8. [State models, cross-role flows and offline recovery](08-states-and-flows.md)
9. [Designathon artifact structure, storyboard, disclosure and tradeoff](09-designathon-artifacts.md)
10. [Master checklist, traceability, decisions and prototype order](10-review-and-compliance.md)
11. [Exact illustrative prototype scenario](11-illustrative-prototype-scenario.md)

## Classification

- **OFFICIAL:** required behavior, operating rule or deliverable supported by the booklet.
- **DESIGN DECISION (DD):** proposed product behavior, status, component, layout, interaction or implementation contract. Approval of this baseline accepts these choices unless a decision is specifically left open.
- **OPTIONAL:** useful enhancement outside the minimum baseline; excluded from the committed prototype unless explicitly included.
- **ILLUSTRATIVE:** independently authored prototype content, not a claim about an official dataset record or computed operational metric.

All screen IDs, screen composition, visual tokens, state-machine names, API/domain projections and interaction rules in this specification are design decisions. Official requirements are referenced in the traceability register. No screen count, UI library, exact POD capture format, individual deferral priority or precise cutoff-boundary convention is prescribed by the booklet.

## Scope and identity

The final inventory contains **38 canonical screens**: 4 shared, 11 Dispatcher, 6 Loader, 10 Driver and 7 Store Manager. Drawers, tabs, sheets and error/offline variants are explicitly owned by these screens; they are not untracked screens. Each canonical screen has every requested specification field and its own rationale paragraph.

This consolidates the earlier long inventory into practical screens without deleting required capabilities. Old-to-new mapping is in the review document. A prototype must include the named variants as well as the default frames; 38 screens does not imply only 38 frames.

Designathon is the immediate delivery priority. A state-complete specification does not substitute for the required high-fidelity design file, working prototype links or actual unlisted YouTube video. Those remain subsequent work.

## Product name placeholder structure

| Surface | Exact structure |
|---|---|
| Product wordmark | `<SOLUTION_NAME>` |
| Tenant/company | `Waypoint Group` |
| Product descriptor | `Delivery operations` |
| Application browser title | `<Screen name> · <SOLUTION_NAME>` |
| Repository | `<TEAM_NAME>_<SOLUTION_NAME>` |
| Design file | `<TEAM_NAME>_Designathon` |
| Design export ZIP | `<TEAM_NAME>_Designathon.zip` |
| Prototype cover | `<SOLUTION_NAME> / Waypoint delivery operations` |
| Notebook and Datathon ZIP | `<TEAM_NAME>_FinalNotebook.ipynb`, `<TEAM_NAME>_Datathon.zip` |

Use `<SOLUTION_NAME>` literally in the specification until naming is approved. Do not mistake Waypoint's tenant identity for the solution name. No invented slogan, logo or brand claim is required. Do not add a fifth operational role for administration or analysis.

## Global content integrity

Official shared record counts describe the network, not today's workload. Never use 120 outlets or 60 vehicles as a fabricated live operational KPI. Prototype fixtures must carry an `Illustrative scenario` annotation and must not imitate a real supplied record's undisclosed constraints. Use `DEMO-ORDER-A`, `DEMO-OUTLET-A`, `DEMO-VEHICLE-A` for independently authored examples until approved official records are available. Unknown values display `Not available` or an em dash with explanatory context, never zero or a fabricated ETA.

The real dataset, templates and allocation checker have not yet been inspected in this phase. Dataset-dependent fixtures and any third-party hosting of competition data remain subject to the reviewed confidentiality decision.
