---
schema: clarification-answers/v1
status: submitted
generated_at: "2026-09-26T10:33:56.954Z"
scope: [frontend, backend, generic]
questions_file: clarification-questions.json
---

# Rearchitecture Clarification Answers

## 🖥️ Frontend

- **F1** Which frontend framework and version should govern the continuation?
  - answer: Preserve the detected frontend stack. Use the existing React + Vite versions already defined in the repository. Do not upgrade framework versions unless required to fix a verified compatibility/security issue
  - source: user
- **F2** Which component or UI library and version should Phase 5-15 frontend work use?
  - answer: Preserve the existing shared UI package and approved Phase 1 design baseline. Use the existing shadcn/ui-compatible primitives and Radix dependencies already present in the repository; do not replace the component system.
  - source: user
- **F3** What screenshots, recordings, or screen-reference artifacts should be treated as the source of truth for existing UI behavior and states?
  - answer: Treat the approved Phase 1 Design Baseline, the current implemented UI in the repository, existing design documentation, and any Phase 1 screenshots/prototypes stored in the project as the source of truth. If they conflict, the approved Phase 1 design specification takes priority. Do not invent UI behavior from external templates.
  - source: user
- **F4** Which design system or token source must the frontend continuation follow?
  - answer: docs/design-baseline and theUse the approved Phase 1 design system and the existing repository design tokens/shared UI package as the source of truth. Preserve typography, spacing, status semantics, component patterns, responsive behavior, and role-specific UX established there. existing shared UI package
  - source: user
- **F5** Which accessibility standard should the frontend continuation target?
  - answer: WCAG 2.1 AA
  - source: user
- **F6** Which browser and runtime compatibility targets must be supported?
  - answer: Support current evergreen desktop browsers: Chrome, Edge, Firefox, and Safari; and current mobile Chrome/Android and Safari/iOS. Prioritize Chromium-based judge environments while avoiding browser-specific implementations.
  - source: user
- **F7** What responsive and breakpoint strategy should govern frontend work?
  - answer: Preserve the existing responsive strategy. Dispatcher is desktop-first; Loader is tablet/mobile optimized; Driver is mobile-first; Store Manager supports mobile and desktop. Use the existing Tailwind breakpoints unless a verified UI issue requires adjustment. Do not simply shrink desktop tables on mobile.
  - source: user
- **F8** Which locales are in scope for the continuation?
  - answer: English only for the competition implementation. Keep user-facing strings structured so localization can be added later, but do not add multilingual scope now.
  - source: user
- **F9** Which client-side state management approach should be used?
  - answer: Use TanStack Query for server state and React local state/useReducer for local UI state. Use React Hook Form for forms and Dexie/IndexedDB for offline driver persistence. Do not introduce Redux unless a later verified requirement proves it necessary.
  - source: user
- **F10** Which routing library or URL strategy should govern the frontend continuation?
  - answer: Preserve React Router and the current role-based URL structure. Maintain protected routes and role-aware navigation. Do not migrate routing frameworks.
  - source: user

## ⚙️ Backend

- **B1** Which backend framework and version should govern the continuation?
  - answer: NestJS modular monolith (version toPreserve the existing NestJS modular monolith and the NestJS version already defined in the repository. Do not upgrade versions without a verified reason. verify)
  - source: user
- **B2** How strictly must existing API routes, payloads, and status codes be preserved during Phase 5-15?
  - answer: must preserve existing Phase 1-4 Must preserve existing API contracts where they are already implemented and used by Phase 1–4. New Phase 5–15 endpoints may be added consistently. Breaking changes are allowed only when fixing a verified design/requirements defect and must be explicitly documented and updated across clients/tests.contracts
  - source: user
- **B3** What database and data migration strategy should govern the continuation?
  - answer: In-place schema evolution using Prisma migrations. Preserve existing Phase 3 data-model decisions and migration history. Do not reset or replace the database schema. Add migrations incrementally and verify clean migration from a fresh database.
  - source: user
- **B4** Which authentication and authorization mechanism must the continuation preserve or target?
  - answer: Preserve the Phase 4 authentication architecture: JWT-based authentication, secure password hashing, RBAC, protected routes, and resource-scoped authorization. Store Managers are outlet-scoped; Drivers are assigned-work scoped; Loaders access relevant loading work; Dispatchers manage planning/operations.
  - source: user
- **B5** What latency, throughput, availability, or regression targets apply to the continuation?
  - answer: No formal SLA is specified by the competition. Avoid measurable regressions. Normal interactive API operations should remain responsive, large lists must use bounded queries/pagination where appropriate, and the system must remain usable on phone-sized field devices. Correctness and operational reliability take priority over artificial benchmark targets.
  - source: user

## 📋 General

- **G1** What measurable outcome defines successful completion of the Phase 5-15 continuation?
  - answer: Phase 5–15 is complete when all implementable competition requirements in the approved specification are implemented and verified, including:

- Store Manager ordering/intake flow
- Dispatcher planning, allocation, validation and deferrals
- Loader workflow and loading exceptions
- Driver delivery and proof of delivery
- Offline driver operation and synchronization/recovery
- Store receipt confirmation and issue reporting
- Dispatcher operational progress/exception views
- Required role-based authorization
- PostgreSQL/Prisma persistence
- Responsive Loader/Driver phone flows
- Competition-critical unit/integration/end-to-end tests
- Clean Docker startup
- README judge walkthrough
- required architecture/data-model/AI-disclosure documentation
- deployment-ready configuration
- Datathon local workspace, validation code, notebook structure and submission tooling that can run locally when authorized competition datasets are supplied

All relevant formatting, lint, typecheck, tests and builds must pass.

Items requiring credentials, official confidential datasets, organizer authorization, public deployment, prototype sharing, YouTube uploads or submission-form actions must be reported as EXTERNAL ACTION REQUIRED or BLOCKED rather than falsely marked complete.

A final requirement traceability audit must classify every requirement as COMPLETE, INCOMPLETE, BLOCKED, or EXTERNAL ACTION REQUIRED.
  - source: user
- **G2** Which files, modules, behaviors, datasets, or phases must remain out of scope?
  - answer: Out of scope:

- Rewriting or discarding valid Phase 1–4 work without a verified reason
- Changing the approved Designathon baseline without documenting a significant departure
- Replacing the React/Vite/NestJS/PostgreSQL/Prisma architecture
- Microservices, Kafka, Kubernetes, RabbitMQ, service mesh, Redis or other unnecessary infrastructure
- Native Android/iOS applications
- Mandatory GPS/live-map tracking not required by the booklet
- Invented business rules or competition requirements
- Treating Task 2B-specific feasibility rules as universal Hackathon rules
- Mandatory photo/signature POD unless explicitly approved as a design enhancement
- Mandatory Datathon-to-Hackathon model integration
- Uploading, committing, transmitting or exposing official competition datasets or derivatives to third parties without explicit organizer authorization
- Proprietary API-based Datathon modelling/preprocessing
- prohibited pretrained models, AutoML or fully automated modelling tools
- Changing external submission artifacts or performing external uploads without the required user authorization/credentials
  - source: user
- **G3** What policy should apply to existing formatting, lint, typecheck, test, and build failures?
  - answer: All existing formatting, lint, typecheck, test and build checks must continue to pass. New Phase 5–15 work must add relevant tests. Do not delete or weaken valid tests simply to obtain a green build. If an existing test is genuinely incompatible with a verified requirement correction, update it while preserving equivalent or stronger coverage and document the reason.
  - source: user
- **G5** Are there additional requirements, exclusions, dependencies, compliance rules, or operational constraints?
  - answer: 1. Preserve all valid Phase 1–4 work and continue in place.

2. The approved Phase 1 Design Baseline and verified competition requirements are the source of truth.

3. Clearly distinguish:
   - OFFICIAL REQUIREMENT
   - DESIGN DECISION
   - OPTIONAL ENHANCEMENT
   - DATATHON-ONLY RULE

4. Do not invent missing competition rules.

5. Use a NestJS modular monolith. Keep business and allocation logic out of React components and controllers.

6. Preserve strict TypeScript and existing repository conventions.

7. Official competition datasets are confidential. Do not upload, transmit, commit, publish, or expose them publicly or privately to third-party systems without explicit organizer authorization.

8. Synthetic development data must be clearly labelled:
   SYNTHETIC DEVELOPMENT DATA — NOT OFFICIAL COMPETITION DATA.

9. Datathon code must be designed to run locally against authorized official files. Do not claim real model performance without running the real data locally.

10. Driver offline operation must be a real persistent workflow, not only an offline banner. Pending work must survive reload and reconcile after connectivity returns.

11. Driver delivery completion and Store Manager receipt confirmation must remain separate concepts.

12. Planning SERVED status must not be treated as actual DELIVERED status.

13. Preserve the distinction between ordinary Hackathon operational validation and Datathon Task 2B-specific rules.

14. Run relevant formatting, linting, typechecking, tests and builds at the end of every implementation phase and fix failures before continuing.

15. Never mark unfinished external actions as complete. Public deployment, videos, prototype sharing and submission forms must be reported accurately.

16. Continue sequentially from Phase 5 through Phase 15 using the existing repository. Do not recreate the project.
  - source: user
