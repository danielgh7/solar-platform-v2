# R6 Review — Solar Operations CRM, Pipeline, Tasks & Project Delivery

## Status

**R6 is complete and stopped for formal review. R7 has not been started.**

R6 adds the operating/commercial layer around the existing solar project without turning `solar-platform-v2` into a generic CRM. The solar project remains the center of gravity and R1–R5 remain authoritative for consumption, sizing, design geometry, electrical/production, BOM/economics and proposal versions.

Final implementation commit validated by CI: `96017be150befbd38ec1fb105f98569ccefb2d08`

Final R6 evidence commit produced by the validated browser run: `ea45ac6` (`chore: add R6 CRM evidence [skip ci]`)

Final R6 workflow run: **34547923733** — `completed / success`

Workflow job: **103104446359** — every required step passed.

---

## Product architecture

### Project-first operating model

R6 does not own or recalculate engineering/commercial truth. It links an `Opportunity` to exactly one primary solar `projectId` and reads accepted outputs through the existing domain composition:

`R1 energy → R2 site design → R3 electrical/production → R4 economics → R5 proposal → R6 operating selectors`

`src/domain/crm/selectors.ts` calls the existing accepted-project output path and maps it into a `CrmProjectSummary`. Values exposed to the CRM include annual consumption, target/installed DC capacity, placed module count, inverter label, annual production, R4 sell price and internal economic metrics, R5 proposal status/version/export timestamp and inherited readiness/blockers.

R6 does **not** implement sizing, production, BOM, economics or proposal snapshot formulas.

### Domain separation

R6 logic is isolated under `src/domain/crm/`:

- `types.ts` — typed CRM, lifecycle, delivery and audit contracts.
- `pipeline.ts` — stable semantic stage IDs, default pipeline, sources, owners and loss reasons.
- `transitions.ts` — validated opportunity lifecycle transitions.
- `commands.ts` — deterministic write commands.
- `validation.ts` — lifecycle/reference/data-integrity validation.
- `selectors.ts` — project-safe read models and table/board selectors.
- `metrics.ts` — deterministic pipeline/funnel metrics.
- `staleness.ts` — explicit inactivity logic.
- `tasks.ts` — task due/completion behavior.
- `timeline.ts` — ordered activity/system timeline.
- `proposalFollowup.ts` — R5 read-through follow-up state.
- `handoff.ts` — sold-project handoff checklist/readiness transitions.
- `audit.ts` — audit entry creation.
- `store.ts` — local persisted CRM state.
- `migration.ts` — storage schema version/migration path.
- `fixtures.ts` — deterministic local/demo and performance fixtures.
- `crm.test.ts` — R6 domain regression suite.

UI routes remain thin consumers of the domain layer. `App.tsx` remains routing-only.

---

## Typed CRM model

R6 defines typed models for the Issue #7 operating scope, including:

- Account / account type
- Contact
- Opportunity
- Opportunity stage/status/source/owner
- Pipeline / PipelineStage
- StageHistoryEntry
- Activity / ActivityType
- Task / status / priority / entity links
- ProjectCommercialState
- ProjectDeliveryState
- ProposalFollowUpState
- LossReason
- HandoffChecklist / HandoffItem
- TimelineEvent
- AuditEntry / AuditEventType
- CrmValidationIssue
- CrmProjectSummary
- persisted CRM view preferences

The relationship contract is project-centric: account/contact → opportunity → one primary solar project → R1–R5 truth → timeline/tasks → sold handoff.

---

## Solar sales pipeline

Default stable semantic IDs:

1. `new` — New lead
2. `contacted` — Contacted
3. `qualified` — Qualified
4. `cfe-pending` — CFE data pending
5. `engineering` — Engineering / sizing
6. `proposal-progress` — Proposal in progress
7. `proposal-sent` — Proposal sent
8. `negotiation` — Negotiation
9. `won` — Won
10. `lost` — Lost

The UI allows local editing of stage labels, stage probability assumptions and stale thresholds, plus deterministic reordering of non-terminal stages. Lifecycle logic continues to use the stable IDs instead of labels.

The table supports search plus filters for stage, owner, source, status, exported/not-exported proposal, overdue and stale opportunities. It also supports useful sorting by last update, R4 project value, expected close date and stale days.

The board is solar-specific and exposes account, project value, DC capacity where available and next action. A keyboard-accessible native stage selector is the supported deterministic non-drag alternative; lifecycle validation is applied to board moves exactly as it is elsewhere.

---

## Opportunity lifecycle

All major lifecycle transitions are typed and validated.

### Proposal Sent

`Proposal sent` cannot be entered unless the linked project summary has an active R5 proposal with `Ready` or `Exported` status. A CRM action never mutates an exported/frozen R5 proposal.

### Won

Won requires:

- explicit `Mark won` action;
- a positive R4 project sell value;
- no stale/out-of-date active R5 proposal blocker.

A stage dropdown alone cannot silently make the opportunity Won.

### Lost

Lost requires an explicit loss reason. Source attribution is preserved.

### Reopen

Only Won/Lost opportunities can be reopened. Reopen returns the opportunity to `Negotiation`, clears terminal timestamps/reason and records the event.

### Sold handoff

Winning creates exactly:

`Sold / handoff pending`

It **does not** declare technical handoff complete and does not declare the project installation-ready. Advancing delivery state is a separate validated action.

---

## Sold-project handoff

Supported delivery states:

- Not sold
- Sold / handoff pending
- Commercial handoff complete
- Technical handoff ready
- Installation planning
- On hold

R6 deliberately stops before installation execution/crew dispatch.

Default checklist contains:

- accepted/final proposal identified;
- final commercial price confirmed;
- customer/contact data complete;
- site information complete;
- CFE consumption source available;
- R2 design valid;
- R3 electrical design valid;
- R3 production available;
- R4 BOM/economics valid;
- customer-facing proposal exported;
- payment/contract status manually recorded;
- interconnection/document requirements manually reviewed;
- installation notes/site constraints reviewed (optional).

Source-derived checklist states are read from R1–R5 readiness. Manual commercial/document items remain explicitly manual; R6 does not pretend an external contract, payment, utility or interconnection system was verified.

Transition gates:

- `Sold / handoff pending → Commercial handoff complete` requires final proposal, price, customer and payment items complete.
- `Commercial handoff complete → Technical handoff ready` requires every required checklist item complete/not-applicable.
- `Technical handoff ready → Installation planning` uses the same explicit readiness requirement.
- `On hold` is explicit and reversible.

---

## R1–R5 blocker propagation

`CrmProjectSummary.blockers` propagates relevant project conditions rather than recomputing them:

- R1 not `Ready for sizing` → `r1-consumption` blocker.
- R2 missing/invalid module layout → `r2-design` blocker.
- R3 electrical validation errors → `r3-electrical` blocker.
- R3 missing production → `r3-production` blocker.
- R4 economics `Blocked` → `r4-economics` blocker.
- R5 not Ready/Exported → proposal warning.
- R5 source snapshot out of date → `r5-outdated` blocker.

Opportunity detail surfaces blocker cards with links back to the relevant project area. Workspace surfaces the commercial/operational strip without displacing engineering-first tabs.

---

## Proposal follow-up

R6 reads the actual R5 active proposal/version state:

- version number;
- status;
- export timestamp;
- source-outdated state;
- days since export;
- next linked follow-up task;
- whether follow-up is due.

Helper actions create local follow-up/new-version work and can move a valid opportunity into negotiation. No action modifies an exported R5 snapshot and no fake proposal-view event is generated. `proposal viewed` remains manual-only when used.

---

## Tasks and operating queue

Tasks support title, description, owner, due date, status, priority, category, related account/contact/opportunity/project and completion timestamp.

The opportunity detail contains its project-linked task list. `/crm` also has a global project-centered task workspace with:

- all tasks;
- overdue;
- due today;
- upcoming;
- completed;
- owner filter;
- links back to solar project and opportunity.

Completion is keyboard-operable and is reflected in audit/timeline behavior. Overdue is a local deterministic date comparison; no notification or external scheduler is implied.

---

## Activity timeline and audit trail

Timeline supports manual and system events such as notes, calls, meetings, site visits, proposal sent/viewed-manual, follow-up, document received, stage changes, task completion, won/lost and handoff events. Events use stable IDs/timestamps and visibly distinguish system-generated vs manual entries.

Audit events include meaningful operating changes such as opportunity creation/update, owner/source/stage changes, project link changes, pipeline config changes, proposal selection/export references, won/lost/reopen, handoff state/item changes, task changes and account/contact changes.

Each audit entry can record:

- event type;
- entity ID;
- timestamp;
- local actor placeholder;
- before value;
- after value;
- optional note.

**Limitation:** this is a local browser audit log, not an append-only/tamper-proof compliance log and not a multi-user audit service.

---

## Deterministic staleness

Staleness is not an AI score. It uses explicit local rules:

- days since meaningful activity;
- the active pipeline stage's editable `staleAfterDays` threshold;
- overdue next action/task context;
- proposal follow-up state where applicable.

Warnings are operating hints only. The thresholds are visible/configurable and do not claim predictive lead scoring.

---

## Metrics and formulas

All R6 metrics use recorded CRM state and R4 value read-through. They are not AI forecasts.

### Pipeline value

`pipelineValue = Σ R4 sell price for open linked opportunities`

Unlinked/pre-R4 opportunities contribute zero rather than an invented amount.

### Opportunity probability

`probability = opportunity override ?? stable-stage probability`

### Weighted pipeline

`weightedPipeline = Σ(open opportunity value × probability / 100)`

This is a deterministic weighted pipeline, not a revenue forecast.

### Win rate

`winRate = wonCount / (wonCount + lostCount) × 100`

If the denominator is zero, the result is `null / Insufficient data`, never infinity or fake 0% precision.

### Average sales cycle

For opportunities with a recorded `wonAt`:

`cycleDays = wonAt - createdAt`

`averageSalesCycle = mean(cycleDays)`

Insufficient samples produce `null`.

### Proposal-sent to won

The denominator is unique opportunities with recorded local stage history in Proposal sent / Negotiation / Won. The numerator is Won opportunities in that set.

`proposalToWon = wonAfterProposalHistory / opportunitiesWithProposalHistory × 100`

Zero denominator produces `null`.

### Overdue tasks

An open task is overdue when:

`task.dueDate < current local YYYY-MM-DD`

Completed/cancelled tasks are excluded.

### Source attribution

For every preserved opportunity source, R6 aggregates opportunity count, won count and linked R4 value. No CAC/ad-platform attribution is inferred.

### Funnel

For each stable stage, R6 derives:

- entered count from `StageHistoryEntry`;
- progressed count from later-stage recorded history;
- local loss/drop context;
- conversion = progressed / entered;
- average days in stage;
- median days in stage.

The UI explicitly states that local incomplete history is not cohort-perfect funnel attribution.

---

## Data integrity and validation

R6 explicitly detects/blocks important invalid state:

- orphan account/contact links;
- duplicate primary project links across active opportunities;
- won/stage mismatch;
- lost/stage mismatch;
- invalid expected close dates;
- invalid probability outside 0–100%;
- Won without positive R4 project value;
- Proposal Sent without eligible R5 proposal;
- Won without explicit action;
- Won with out-of-date R5 proposal;
- Lost without reason;
- orphan tasks/activities/stage history;
- open tasks linked to archived opportunity warning;
- invalid/impossible stage timestamps.

Terminal status is not treated as an open opportunity in pipeline metrics.

---

## Persistence and schema migration

Storage key:

`solar-platform-v2:r6:crm:default`

Current persisted schema:

`schemaVersion: 2`

Persisted state includes accounts, contacts, opportunities, pipeline config, owners, source labels, loss reasons, activities, tasks, stage history, commercial delivery states, handoff checklists, audit entries and view preferences.

`migrateCrmState()` provides deterministic migration from schema v1 → v2 while preserving records and filling newly introduced sources/loss reasons/view preferences. Unknown/empty state initializes a current-schema state. Current-schema round-trip persistence is covered by tests.

R6 remains local-browser persistence only. Production database, concurrency, sync and server migration orchestration are R7+ work.

---

## Selector/performance design

Common table/board selectors avoid repeatedly scanning the complete task collection for every opportunity. `opportunityRows()` builds a `tasksByOpportunity` index once, then performs per-row lookup. Account and owner lookup are likewise indexed maps.

Final required realistic browser dataset:

- **250 opportunities**
- **1,000 tasks**
- **2,500 activity/timeline events**

Final performance validation output:

`R6 performance validation passed: 250 opportunities / 1,000 tasks / 2,500 events. Table=558ms, board=195ms.`

These numbers include the browser navigation/render validation fixture and are not a server benchmark. They demonstrate that the current local-only operating dataset remains responsive at the Issue #7 target size.

---

## Accessibility

Critical R6 operating actions use semantic buttons, labels, native inputs/selects and visible `:focus-visible` treatment.

Validated behavior includes keyboard focus + Enter completion of an overdue task. Board stage movement does not depend on drag-and-drop: every card exposes a labeled native stage selector using the same deterministic transition validation. Status/readiness content includes text labels rather than relying on color alone.

The desktop table uses horizontal overflow at constrained widths instead of clipping critical columns, and the detail layout collapses to one column below the desktop breakpoint.

---

## Final tests

Final workflow command:

`npm test`

Result:

- Test files: **7 passed / 7**
- Tests: **135 passed / 135**
- R6 CRM domain: **29 tests**
- R4 economics: 33
- R5 proposal: 20
- R3 electrical: 19
- R2 design: 16
- R1 energy: 16
- economics completeness: 2

R6 coverage includes relationships, pipeline order, valid/invalid transitions, R5 proposal gating, explicit Won/value validation, Lost reason, reopen, weighted metrics, zero denominators, stage timestamps, staleness, overdue/completion, timeline ordering/manual-system distinction, R5 follow-up/frozen safety, handoff, audit, source aggregation, sales cycle, funnel, migration, persistence, orphan/duplicate validation and required synthetic dataset/performance sanity.

---

## Production build

Final command:

`npm run build`

Result: **success**

Environment in final run:

- Node `22.23.2`
- npm `10.9.8`
- Vite `8.3.0`
- 2,715 modules transformed
- build completed successfully (`742ms` Vite build step)

Output included a non-blocking Vite chunk-size advisory for the accumulated application bundle. Code splitting remains a future packaging/performance optimization; it did not block the R6 acceptance performance target.

---

## Final Chromium validation

Final command:

`npm run validate:r6`

Final output:

`R6 browser validation passed: project-centered table/search/source/proposal filters, configurable pipeline persistence, board accessible stage changes, detail/account/contact, timeline, global tasks/overdue/keyboard completion, R5 follow-up, lost/reopen/won, explicit handoff, inherited blockers, Workspace persistence and analytics/funnel.`

The production preview validation explicitly exercised:

- populated project-centered CRM table;
- search/source/proposal filtering and sorting;
- configurable pipeline label/stale threshold persistence;
- creating/opening an opportunity;
- account/contact editing and persistence;
- board view and accessible stage move;
- blocked invalid Proposal Sent transition;
- linked solar project detail;
- R5 exported-proposal follow-up state;
- valid stage progression;
- activity creation/timeline persistence;
- task creation;
- overdue state;
- global task operating queue;
- keyboard task completion;
- Lost with reason;
- reopen;
- explicit Won;
- Won → Sold / handoff pending only;
- checklist-gated commercial/technical handoff;
- inherited R1 blocker after source degradation;
- Workspace R6 strip;
- analytics/funnel;
- refresh persistence.

---

## Final screenshot evidence

All 13 required final real-browser screenshots exist under `artifacts/screenshots/r6/`:

1. `crm-opportunities-table.png`
2. `crm-pipeline-board.png`
3. `crm-opportunity-detail.png`
4. `crm-account-contact.png`
5. `crm-activity-timeline.png`
6. `crm-tasks.png`
7. `crm-overdue.png`
8. `crm-proposal-followup.png`
9. `crm-stage-blocked.png`
10. `crm-won-handoff.png`
11. `crm-handoff-checklist.png`
12. `crm-analytics-funnel.png`
13. `workspace-r6.png`

The final capture step completed successfully after the final Chromium validation and performance validation. `crm-tasks.png` and `crm-overdue.png` specifically show the global project-centered task workspace rather than only the opportunity-detail task widget.

---

## Acceptance criteria — 36/36

1. ✅ Solar project remains the primary operational entity.
2. ✅ Typed CRM domain model exists.
3. ✅ Accounts, contacts and opportunities are implemented.
4. ✅ Configurable solar-specific pipeline is implemented with stable semantic IDs.
5. ✅ Stage transitions are validated and deterministic.
6. ✅ Opportunity supports one primary solar-project link with duplicate-link protection.
7. ✅ R1–R5 values are read through existing accepted outputs; no duplicate engines.
8. ✅ Workspace contains compact R6 commercial/operational state while engineering remains primary.
9. ✅ CRM table has solar columns, search, required filters and useful sorting.
10. ✅ Pipeline board works and includes accessible non-drag stage movement.
11. ✅ Opportunity detail combines account/contact, solar project, proposal, timeline, tasks and lifecycle/handoff.
12. ✅ Activity/timeline works, distinguishes system/manual entries and persists.
13. ✅ Tasks support overdue/today/upcoming/completed/owner/project-opportunity operating views and completion.
14. ✅ Real R5 proposal follow-up state is consumed without mutating frozen proposals.
15. ✅ Staleness is deterministic with explicit stage thresholds.
16. ✅ Source attribution exists and is preserved through lifecycle.
17. ✅ Pipeline/win/weighted/source/proposal conversion metrics are deterministic and zero-safe.
18. ✅ Funnel/stage-history metrics are deterministic and explicitly limited to local recorded history.
19. ✅ Won/Lost/reopen lifecycle is implemented and audited.
20. ✅ Won creates `Sold / handoff pending`, never automatic installation readiness.
21. ✅ Handoff checklist and gated readiness transitions are implemented.
22. ✅ R1–R5 blockers propagate into R6 and link to the relevant project area.
23. ✅ Local deterministic audit trail records important lifecycle/configuration changes.
24. ✅ Local persistence has explicit schema versioning and migration.
25. ✅ Invalid/orphan/duplicate/impossible reference states are validated.
26. ✅ Realistic local dataset performance target was validated successfully.
27. ✅ Critical actions have labels, keyboard operation, focus visibility and non-color status text.
28. ✅ All tests pass: 135/135.
29. ✅ `npm run build` succeeds.
30. ✅ Production Chromium validation ran after final product/test fixes and passed.
31. ✅ SolarERP was not used/imported.
32. ✅ R7 was not started.
33. ✅ This `R6_REVIEW.md` documents architecture, lifecycle, pipeline assumptions, formulas, handoff, audit limitations, persistence/versioning, tests, browser validation, performance, limitations and deferrals.
34. ✅ All 13 required screenshot filenames exist.
35. ✅ Screenshot evidence came from the final production-browser capture step after validation.
36. ✅ R6 stops here for formal review; no R7 work has begun.

---

## Known R6 limitations

These are deliberate boundaries of R6, not hidden integrations:

- browser-local persistence only;
- local single-user actor fixtures, no real identity/RBAC service;
- local audit history is not tamper-proof;
- no real email/WhatsApp/calendar notifications;
- no server-side task scheduler;
- no real proposal-open/read receipt;
- no external lead/ad attribution or CAC ingestion;
- funnel is based on available local history and is not cohort-perfect after partial/migrated history;
- weighted pipeline is deterministic probability weighting, not predictive forecasting;
- no installation execution, crew scheduling, procurement/inventory or field service;
- no production backend or multi-device sync;
- current Vite production bundle emits a non-blocking >500 kB chunk advisory; route-level code splitting is a future packaging optimization.

---

## Explicit R7+ deferrals

Not implemented in R6:

- production backend/database;
- multi-user synchronization;
- auth hardening;
- full RBAC/permissions;
- Gmail/Outlook/email integration;
- WhatsApp integration;
- Google/Outlook calendar integration;
- webhooks/automation engine;
- customer portal;
- e-signature/acceptance;
- online payments;
- installation scheduling/crew dispatch;
- inventory/procurement/supplier purchasing;
- automated utility/interconnection workflows;
- service tickets/O&M;
- telemetry/monitoring integrations;
- AI/OCR extraction;
- AI sales assistant/lead scoring;
- predictive forecasting;
- mobile field application;
- official continuously updated CFE tariff provider;
- expanded 8760/battery workflows beyond accepted R1–R5 scope.

---

## Stop condition

R6 is complete against Issue #7 and is now **stopped for formal review**. No R7 implementation has been started.
